import { useEffect, useRef, useMemo, useState } from "react";
import { startConnection, connection } from "../signalr/connection";

type GroupHandler = {
    group: string;
    handlers: Record<string, (...args: any[]) => void>;
};

export function useSignalRGroups(groups: GroupHandler[]) {    
    const [isConnected, setIsConnected] = useState(false);
    
    const joinedGroupsRef = useRef<Set<string>>(new Set());
    const handlersRef = useRef<Record<string, Record<string, (...args: any[]) => void>>>({});

    // Tạo dependency key ổn định cho groups
    const groupsKey = useMemo(() =>
        groups.map(g => g.group).sort().join(','),
        [groups]
    );

    // Cập nhật handler mới khi deps thay đổi
    useEffect(() => {
        const map: Record<string, Record<string, (...args: any[]) => void>> = {};
        groups.forEach(({ group, handlers }) => {
            map[group] = handlers;
        });
        handlersRef.current = map;
    }, [groups]);

    // Join/Leave các group
    useEffect(() => {

        const manageGroups = async () => {
            await startConnection();
    
            const maxWaitTime = 5000; // 5 giây
            const startTime = Date.now();
            
            while ((!connection || connection.state !== "Connected") && 
                   Date.now() - startTime < maxWaitTime) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            if (!connection || connection.state !== "Connected") {
                return;
            }

            const currentGroups = new Set(groups.map((g) => g.group));

            // Join tất cả groups mới (bao gồm cả user và page groups)
            const joinPromises = Array.from(currentGroups)
                .filter((group) => !joinedGroupsRef.current.has(group))
                .map(async (group) => {
                    try {
                        await connection.invoke("JoinGroup", group);
                        joinedGroupsRef.current.add(group);
                    } catch (err) {
                        console.error(`Failed to join group ${group}:`, err);
                    }
                });

            // Leave page groups không còn trong list (không leave user groups)
            const leavePromises = Array.from(joinedGroupsRef.current)
                .filter((group) => !currentGroups.has(group) && !group.startsWith('user:'))
                .map(async (group) => {
                    try {
                        await connection.invoke("LeaveGroup", group);
                        joinedGroupsRef.current.delete(group);
                    } catch (err) {
                        console.error(`Failed to leave group ${group}:`, err);
                    }
                });

            await Promise.all([...joinPromises, ...leavePromises]);
        };

        manageGroups();

        return () => {
        };
    }, [groupsKey]);

    // Lắng nghe sự kiện từ server
    useEffect(() => {
        if (!connection) return;

        const eventHandler = (action: string, data: any, actionBy: string) => {
            for (const group in handlersRef.current) {
                const handler = handlersRef.current[group]?.[action];
                if (handler) handler(data, actionBy);
            }
        };

        connection.on("ReceiveMessage", eventHandler);

        return () => {
            connection.off("ReceiveMessage", eventHandler);
        };
    }, []);

    // Cleanup: Leave tất cả groups khi component unmount
    useEffect(() => {
        return () => {
            if (connection && joinedGroupsRef.current.size > 0) {
                // Leave tất cả groups của component này (không bao gồm user groups)
                const groupsToLeave = Array.from(joinedGroupsRef.current);
                groupsToLeave.forEach(async (group) => {
                    // Không bao giờ leave user groups
                    if (!group.startsWith('user:')) {
                        try {
                            await connection.invoke("LeaveGroup", group);
                        } catch (err) {
                            console.error(`Cleanup failed for group ${group}:`, err);
                        }
                    } else {
                        console.log(`Skip cleanup for user group: ${group}`);
                    }
                });
                joinedGroupsRef.current.clear();
            }
        };
    }, []);

    useEffect(() => {
        const updateConnectionStatus = () => {
            if (connection) {
                setIsConnected(connection.state === "Connected");
            } else {
                setIsConnected(false);
            }
        };
        
        // Update initial status
        updateConnectionStatus();
        
        if (connection) {
            // Setup listeners
            const onClose = () => {
                updateConnectionStatus();
            };
            const onReconnecting = () => {
                updateConnectionStatus();
            };
            const onReconnected = () => {
                updateConnectionStatus();
            };
            
            connection.onclose(onClose);
            connection.onreconnecting(onReconnecting);
            connection.onreconnected(onReconnected);
        }
        
        // Poll connection status as fallback
        const interval = setInterval(updateConnectionStatus, 10000);
        
        return () => {
            clearInterval(interval);
        };
    }, [connection]);
        
    return {
        isConnected
    };
}
