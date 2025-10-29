"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initAuth = useAuthStore((state) => state.initAuth);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    (async () => {
      try {
        if (typeof window === "undefined") {
          console.log(
            "🔐 [AuthProvider] SSR режим, пропускаю встановлення кукі"
          );
          return;
        }
        if (token) {
          console.log("🔐 [AuthProvider] Токен змінився, встановлюю кукі:", {
            hasToken: !!token,
            tokenLength: token.length,
          });
          const response = await fetch("/api/set-user-cookie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
          console.log("🔐 [AuthProvider] set-user-cookie відповідь:", {
            status: response.status,
            ok: response.ok,
          });
        } else {
          console.log("🔐 [AuthProvider] Токен відсутній, не встановлюю кукі");
        }
      } catch (error) {
        console.error("🔐 [AuthProvider] Помилка встановлення кукі:", error);
      }
    })();
  }, [token]);

  return <>{children}</>;
}
