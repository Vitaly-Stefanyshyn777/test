"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { getMyProfile } from "@/lib/auth";

export function useUserProfile() {
  const authUser = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const setUser = useAuthStore((s) => s.setUser);

  const [isReady, setIsReady] = useState(false);

  type SavedUser = {
    displayName?: string;
    nicename?: string;
    id?: string;
    email?: string;
  } | null;

  const savedUser = useMemo<SavedUser>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("bfb_user");
      return raw ? (JSON.parse(raw) as SavedUser) : null;
    } catch {
      return null;
    }
  }, []);

  const displayName = useMemo(() => {
    const raw =
      authUser?.displayName ||
      authUser?.nicename ||
      authUser?.id ||
      savedUser?.displayName ||
      savedUser?.nicename ||
      savedUser?.id ||
      "Користувач";

    const trimmed = String(raw).replace(/\s+/g, " ").trim();
    const parts = trimmed.split(" ");
    let collapsed = trimmed;
    if (
      parts.length === 2 &&
      parts[0].replace(/!+$/, "") === parts[1].replace(/!+$/, "")
    ) {
      collapsed = parts[0];
    }
    return collapsed.replace(/!+$/, "");
  }, [authUser?.displayName, authUser?.nicename, authUser?.id, savedUser]);

  const email = useMemo(() => {
    return authUser?.email || savedUser?.email || "";
  }, [authUser?.email, savedUser?.email]);

  useEffect(() => {
    if (isHydrated) {
      const t = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(t);
    }
  }, [isHydrated]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!token) return;
        const data = await getMyProfile();
        if (!mounted || !data) return;
        const resolvedName =
          data?.name ||
          `${data?.first_name ?? ""} ${data?.last_name ?? ""}`.trim();
        const resolvedEmail = data?.email || data?.user_email || "";
        const newUser = {
          id: String(data?.id || authUser?.id || ""),
          email: resolvedEmail || authUser?.email,
          nicename: data?.slug || authUser?.nicename,
          displayName: resolvedName || authUser?.displayName,
        };
        setUser(newUser);
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, [
    token,
    setUser,
    authUser?.id,
    authUser?.email,
    authUser?.nicename,
    authUser?.displayName,
  ]);

  return { isHydrated, isReady, displayName, email };
}
