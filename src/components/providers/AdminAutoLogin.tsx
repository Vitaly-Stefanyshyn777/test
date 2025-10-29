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

        await fetch("/api/admin-login", { method: "POST" });
      } catch {}
    };

    run();
  }, []);
  return null;
}
