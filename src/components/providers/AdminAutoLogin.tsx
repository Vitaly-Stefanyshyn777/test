"use client";

import { useEffect } from "react";

export default function AdminAutoLogin() {
  useEffect(() => {
    const run = async () => {
      try {
        const probe = await fetch(
          "/api/proxy?path=" +
            encodeURIComponent("/wp-json/wp/v2/users?per_page=1"),
          {
            method: "GET",
            cache: "no-store",
            headers: { "x-internal-admin": "1" },
          }
        );

        if (probe.ok) {
          return;
        }

        // 1) Отримуємо admin JWT у httpOnly cookie
        await fetch("/api/admin-login", { method: "POST" });
        // 2) Також отримуємо wp_jwt у httpOnly cookie для WC ендпоінтів
        await fetch("/api/auth/wp-token", { method: "GET", cache: "no-store" });
        // Невелика пауза, щоб кукі застосувалися для подальших серверних хендлерів
        await new Promise((r) => setTimeout(r, 250));
      } catch {}
    };

    run();
  }, []);
  return null;
}
