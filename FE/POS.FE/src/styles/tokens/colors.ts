export const colors = {
    primary: "#4f46e5",
    primaryMuted: "#c7d2fe",
    primarySoft: "#eef2ff",
    secondary: "#10b981",
    accent: "#f59e0b",
    critical: "#dc2626",
    brand: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
    },
    surface: {
      base: "#ffffff",
      muted: "#f9fafb",
      subtle: "#f3f4f6",
      soft: "#e5e7eb",
      elevated: "#fdfdff",
    },
    border: {
      subtle: "#e5e7eb",
      strong: "#d1d5db",
      accent: "#c7d2fe",
    },
    text: {
      primary: "#111827",
      emphasis: "#1f2937",
      secondary: "#374151",
      muted: "#4b5563",
      subtle: "#6b7280",
      faded: "#9ca3af",
      onAccent: "#ffffff",
    },
    state: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#dc2626",
    },
    neutral: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
  } as const;
  
  export type Colors = typeof colors;
  
  