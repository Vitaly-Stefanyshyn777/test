"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile } from "@/lib/auth";
import { adminRequest } from "@/lib/api";

export type WpUserMe = {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  email?: string;
  user_email?: string;
  social_phone?: string;
  social_telegram?: string;
  social_instagram?: string;
  meta?: Record<string, string>;
  avatar?: string;
};

async function fetchUserMe(): Promise<WpUserMe> {
  const data = (await getMyProfile()) as unknown as WpUserMe;
  return data;
}

export function useUserProfileQuery() {
  return useQuery({
    queryKey: ["user-profile", "me"],
    queryFn: fetchUserMe,
    staleTime: 60_000,
  });
}

export function useUpdateUserProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id: number | string;
      body: {
        first_name?: string;
        last_name?: string;
        email?: string;
        meta?: Record<string, unknown>;
      };
    }) => {
      const res = await adminRequest({
        method: "PATCH",
        url: "/api/proxy",
        params: {
          path: `/wp-json/wp/v2/users/${encodeURIComponent(String(payload.id))}`,
        },
        data: payload.body,
      });
      return res.data as unknown;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-profile", "me"] });
    },
  });
}


