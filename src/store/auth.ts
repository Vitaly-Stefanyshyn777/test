import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginApi, getMyProfile } from "@/lib/auth";

function readInitialAuth(): {
  token: string | null;
  user: AuthUser | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
} {
  if (typeof window === "undefined") {
    return { token: null, user: null, isLoggedIn: false, isHydrated: false };
  }
  try {
    const token =
      localStorage.getItem("bfb_token") ||
      localStorage.getItem("bfb_token_old");
    const raw = localStorage.getItem("bfb_user");
    const user = raw ? (JSON.parse(raw) as AuthUser) : null;
    return { token, user, isLoggedIn: !!token, isHydrated: true };
  } catch {
    return { token: null, user: null, isLoggedIn: false, isHydrated: true };
  }
}
const initial = readInitialAuth();

export interface AuthUser {
  id?: string;
  email?: string;
  nicename?: string;
  displayName?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  setAuth: (token: string, user?: AuthUser | null) => void;
  setUser: (user: AuthUser | null) => void;
  clear: () => void;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void;
  checkTokenValidity: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: initial.user,
      token: initial.token,
      isLoggedIn: initial.isLoggedIn,
      isHydrated: initial.isHydrated,

      setAuth: (token: string, user: AuthUser | null = null) => {
        localStorage.setItem("bfb_token", token);
        if (user) {
          localStorage.setItem("bfb_user", JSON.stringify(user));
        }

        set({ token, user, isLoggedIn: true });
      },

      setUser: (user: AuthUser | null) => {
        if (user) {
          localStorage.setItem("bfb_user", JSON.stringify(user));
        } else {
          localStorage.removeItem("bfb_user");
        }
        set({ user });
      },

      clear: () => {
        localStorage.removeItem("bfb_token");
        localStorage.removeItem("bfb_token_old");
        localStorage.removeItem("bfb_user");
        set({ token: null, user: null, isLoggedIn: false });
      },

      initAuth: () => {
        console.log("🔐 [AuthStore] initAuth() викликано");
        if (typeof window !== "undefined") {
          const savedToken = localStorage.getItem("bfb_token");
          const savedUserRaw = localStorage.getItem("bfb_user");

          console.log("🔐 [AuthStore] localStorage дані:", {
            hasToken: !!savedToken,
            tokenLength: savedToken?.length || 0,
            hasUser: !!savedUserRaw,
            userData: savedUserRaw ? "present" : "missing",
          });

          let parsedUser: AuthUser | null = null;
          if (savedUserRaw) {
            try {
              parsedUser = JSON.parse(savedUserRaw);
              console.log("🔐 [AuthStore] Користувач розпарсено:", {
                id: parsedUser?.id,
                email: parsedUser?.email,
                displayName: parsedUser?.displayName,
              });
            } catch (error) {
              console.error(
                "🔐 [AuthStore] Помилка парсингу користувача:",
                error
              );
              parsedUser = null;
              localStorage.removeItem("bfb_user");
            }
          }

          if (savedToken) {
            console.log("🔐 [AuthStore] Токен знайдено, встановлюю стан...");
            set({
              token: savedToken,
              user: parsedUser,
              isLoggedIn: true,
              isHydrated: true,
            });

            console.log(
              "🔐 [AuthStore] Відправляю токен на сервер для встановлення кукі..."
            );
            fetch("/api/set-user-cookie", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: savedToken }),
            })
              .then((response) => {
                console.log("🔐 [AuthStore] set-user-cookie відповідь:", {
                  status: response.status,
                  ok: response.ok,
                });
                return response;
              })
              .catch((error) => {
                console.error("🔐 [AuthStore] Помилка set-user-cookie:", error);
              })
              .finally(() => {
                console.log("🔐 [AuthStore] Перевіряю валідність токена...");
                get().checkTokenValidity();
              });
          } else {
            console.log(
              "🔐 [AuthStore] Токен не знайдено, встановлюю тільки isHydrated"
            );
            set({ isHydrated: true });
          }
        } else {
          console.log("🔐 [AuthStore] SSR режим, пропускаю initAuth");
        }
      },

      checkTokenValidity: async () => {
        const { token, user } = get();

        console.log("🔐 [AuthStore] checkTokenValidity() викликано", {
          hasToken: !!token,
          tokenLength: token?.length || 0,
          hasUser: !!user,
        });

        if (!token) {
          console.log("🔐 [AuthStore] Токен відсутній, повертаю false");
          return false;
        }

        try {
          console.log("🔐 [AuthStore] Запитую профіль користувача...");
          const profile = await getMyProfile();
          console.log("🔐 [AuthStore] Профіль отримано:", {
            hasProfile: !!profile,
            profileId: profile?.id,
            profileEmail: profile?.email,
            profileName: profile?.name,
          });

          if (!profile) {
            console.log("🔐 [AuthStore] Профіль не знайдено, повертаю false");
            return false;
          }

          const resolvedName =
            profile?.name ||
            `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim();
          const resolvedEmail =
            profile?.email || profile?.user_email || user?.email;

          const nextUser: AuthUser = {
            id: String(profile?.id || user?.id || ""),
            email: resolvedEmail,
            nicename: profile?.slug || user?.nicename,
            displayName: resolvedName || user?.displayName,
          };

          console.log("🔐 [AuthStore] Оновлюю дані користувача:", nextUser);
          localStorage.setItem("bfb_user", JSON.stringify(nextUser));
          set({ user: nextUser, isLoggedIn: true });
          console.log("🔐 [AuthStore] Токен валідний, автологін успішний!");
          return true;
        } catch (error) {
          console.error("🔐 [AuthStore] Помилка перевірки токена:", error);
          console.log(
            "🔐 [AuthStore] Повертаю true (токен вважається валідним)"
          );
          return true;
        }
      },

      login: async (credentials) => {
        try {
          const data = await loginApi(credentials);

          const user = {
            id: data.user_nicename,
            email: data.user_email,
            displayName: data.user_display_name,
          };

          localStorage.setItem("bfb_token", data.token);
          localStorage.setItem("bfb_user", JSON.stringify(user));

          set({
            user,
            token: data.token,
            isLoggedIn: true,
          });
        } catch (error) {
          throw error;
        }
      },

      logout: async () => {
        localStorage.removeItem("bfb_token");
        localStorage.removeItem("bfb_token_old");
        localStorage.removeItem("bfb_user");
        set({ user: null, token: null, isLoggedIn: false });
        try {
          await fetch("/api/set-user-cookie", { method: "DELETE" });
        } catch {}
      },
    }),
    {
      name: "bfb-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);
