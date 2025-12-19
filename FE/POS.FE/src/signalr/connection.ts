import {
    HubConnectionBuilder,
    HubConnection,
    LogLevel,
    HubConnectionState,
  } from "@microsoft/signalr";
  import config from "../config/config";
  
  export let connection: HubConnection;
  // Global tracking cho reconnect - chỉ dùng bởi connection.ts
  // Các hooks riêng sẽ tự quản lý groups của mình
  let joinedGroups: Set<string> = new Set();
  
  export async function startConnection() {
    if (!connection) {
      connection = new HubConnectionBuilder()
        .withUrl(`${config.API_BASE_URL}/notificationHub`, {
          withCredentials: true,
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();
  
      connection.onclose((err) => console.warn("Connection closed", err));
      connection.onreconnecting((err) =>
        console.warn("Reconnecting...", err)
      );
      connection.onreconnected(async () => {
        console.log("Reconnected, rejoining groups...");
        for (const group of joinedGroups) {
          try {
            await connection.invoke("JoinGroup", group);
            console.log(`Rejoined group: ${group}`);
          } catch (err) {
            console.error("Failed to rejoin group", group, err);
          }
        }
      });
    }
  
    if (connection.state === HubConnectionState.Disconnected) {
      await startConnectionWithRetry();
    }
  
    return connection;
  }
  
  async function startConnectionWithRetry(retries = 5) {
    for (let i = 0; i < retries; i++) {
      try {
        await connection.start();
        console.log("SignalR connected");
        return;
      } catch (err) {
        console.error(`Connect attempt ${i + 1} failed`, err);
        await new Promise((res) => setTimeout(res, (i + 1) * 2000));
      }
    }
    console.error("Could not connect after retries");
  }
  
  // Hàm tiện ích - không khuyến khích sử dụng trực tiếp
  // Nên sử dụng useSignalRGroups hoặc useUserSignalR thay thế
  export async function joinGroup(groupName: string) {
    if (!connection) {
      await startConnection();
    }
    if (connection.state !== HubConnectionState.Connected) {
      console.warn("Not connected yet, retrying...");
      await startConnection();
    }
    try {
      await connection.invoke("JoinGroup", groupName);
      joinedGroups.add(groupName);
      console.log(`[connection.ts] Joined group: ${groupName}`);
    } catch (err) {
      console.error("[connection.ts] Join group failed", err);
    }
  }
  
  export function onMessage(
    callback: (action: string, data: any, actionby: string) => void
  ) {
    if (!connection) return;
    connection.on(
      "ReceiveMessage",
      (action: string, data: any, actionby: string) => {
        callback(action, data, actionby);
      }
    );
  }
  
  // Hàm tiện ích - không khuyến khích sử dụng trực tiếp  
  // Nên sử dụng useSignalRGroups hoặc useUserSignalR thay thế
  export async function leaveGroup(groupName: string) {
    if (!connection || connection.state !== HubConnectionState.Connected) {
      console.warn("Cannot leave group - not connected");
      return;
    }
    try {
      await connection.invoke("LeaveGroup", groupName);
      joinedGroups.delete(groupName);
      console.log(`[connection.ts] Left group: ${groupName}`);
    } catch (err) {
      console.error("[connection.ts] Leave group failed", err);
    }
  }