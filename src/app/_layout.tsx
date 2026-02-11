import { AuthProvider, useAuth } from "@/lib/modules/auth/AuthProvider";
import { usePushNotifications } from "@/lib/modules/notifications/usePushNotifications";
import { Stack } from "expo-router";

const DARK_THEME = {
  headerStyle: { backgroundColor: "#0f0f0f" },
  headerTintColor: "#ffffff",
  headerTitleStyle: { color: "#ffffff" },
  contentStyle: { backgroundColor: "#0f0f0f" },
  headerShown: false,
} as const;

function AuthLayout() {
  const { session } = useAuth();
  const userId = session?.user.id;

  // Registra push notifications cuando hay sesión activa
  usePushNotifications(userId);

  return <Stack screenOptions={DARK_THEME} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthLayout />
    </AuthProvider>
  );
}
