import { TrainerUser } from "./types";
import api from "@/lib/api";

export function buildAuthHeaders(): Headers {
  const rawEnv = process.env.NEXT_PUBLIC_BFB_TOKEN ?? "";
  const tokenClean = rawEnv
    .trim()
    .replace(/(^['"]|['"]$)/g, "")
    .replace(/[^\x00-\x7F]/g, "");
  const headers = new Headers();
  if (tokenClean && /^[A-Za-z0-9._\-]+$/.test(tokenClean)) {
    headers.set("Authorization", `Bearer ${tokenClean}`);
  }
  return headers;
}

export async function fetchTrainer(id: string): Promise<TrainerUser> {
  try {
    const response = await api.get("/api/proxy", {
      params: {
        path: `/wp-json/wp/v2/users/${id}`,
      },
      headers: { "x-internal-admin": "1" },
    });

    const rawData = response.data;

    const trainer: TrainerUser = {
      id: rawData.id,
      name: rawData.name || "Тренер",
      super_power: rawData.super_power || "Не вказано",
      favourite_exercise: rawData.favourite_exercise || "Не вказано",
      experience: rawData.experience || "Не вказано",
      avatar:
        (typeof rawData.avatar_urls?.thumbnail === "string"
          ? rawData.avatar_urls.thumbnail
          : undefined) ||
        (typeof rawData.avatar_urls?.medium === "string"
          ? rawData.avatar_urls.medium
          : undefined),
      locations: rawData.locations || [],
      my_experience: rawData.my_experience || [],
      my_wlocation: rawData.my_wlocation || [],
      gallery: rawData.gallery,
      certificate: rawData.certificate,
      input_text_phone:
        rawData.input_text_phone || rawData.meta?.input_text_phone,
      input_text_email:
        rawData.input_text_email || rawData.meta?.input_text_email,
      input_text_address:
        rawData.input_text_address || rawData.meta?.input_text_address,
      input_text_schedule:
        rawData.input_text_schedule || rawData.meta?.input_text_schedule,
      hl_data_gallery: rawData.hl_data_gallery || rawData.meta?.hl_data_gallery,
      hl_data_contact: rawData.hl_data_contact || rawData.meta?.hl_data_contact,
      social_phone: rawData.social_phone,
      location_city: rawData.location_city,
      location_country: rawData.location_country,
    };

    return trainer;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "status" in error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      try {
        const { getAllCoaches } = await import("@/lib/coaches");
        const allCoaches = await getAllCoaches();
        const coach = allCoaches.find((c) => String(c.id) === id);
        if (coach) {
          const trainer: TrainerUser = {
            id: coach.id,
            name: coach.name || "Тренер",
            super_power: coach.super_power || "Не вказано",
            favourite_exercise: Array.isArray(coach.favourite_exercise)
              ? coach.favourite_exercise.join(", ")
              : coach.favourite_exercise || "Не вказано",
            experience: coach.experience || "Не вказано",
            avatar: Array.isArray(coach.avatar)
              ? coach.avatar[0]
              : coach.avatar,
            locations: [],
            my_experience: coach.my_experience || [],
            my_wlocation: coach.my_wlocation || [],
            gallery: Array.isArray(coach.gallery)
              ? coach.gallery
              : coach.gallery,
            certificate: coach.certificate,
            input_text_phone: "",
            input_text_email: "",
            input_text_address: "",
            input_text_schedule: "",
            hl_data_gallery: [],
            hl_data_contact: [],
            social_phone: "",
            location_city: Array.isArray(coach.location_city)
              ? coach.location_city.join(", ")
              : coach.location_city,
            location_country: Array.isArray(coach.location_country)
              ? coach.location_country.join(", ")
              : coach.location_country,
          };

          return trainer;
        }
      } catch {}
    }

    throw error;
  }
}

export function getAvatarUrl(
  avatarField: TrainerUser["avatar"]
): string | undefined {
  if (typeof avatarField === "string") {
    return avatarField;
  }
  if (avatarField && typeof avatarField === "object" && "url" in avatarField) {
    return (avatarField as { url: string }).url;
  }
  return undefined;
}

export function getSpecialties(trainer: TrainerUser): string[] {
  if (!trainer.my_specialty || !Array.isArray(trainer.my_specialty)) {
    return ["Не вказано"];
  }
  return trainer.my_specialty
    .filter((spec: unknown): spec is string => typeof spec === "string")
    .slice(0, 3);
}

export function getFavouriteExercises(user: TrainerUser): string[] {
  const raw = user?.favourite_exercise;
  if (Array.isArray(raw))
    return raw.filter((x): x is string => typeof x === "string");
  if (typeof raw === "string" && raw.trim()) return [raw];
  return [];
}

export function getGalleryImages(
  galleryField: TrainerUser["gallery"]
): string[] {
  if (typeof galleryField === "string") {
    return [galleryField];
  }
  if (Array.isArray(galleryField)) {
    const result = galleryField.filter(
      (x): x is string => typeof x === "string"
    );
    return result;
  }
  return [];
}

export function getHlDataGallery(hlDataGallery: unknown): string[] {
  if (!hlDataGallery || !Array.isArray(hlDataGallery)) return [];
  return hlDataGallery
    .filter(
      (item): item is { hl_img_link_photo: string[] } =>
        item &&
        typeof item === "object" &&
        "hl_img_link_photo" in item &&
        Array.isArray(item.hl_img_link_photo)
    )
    .flatMap((item) => item.hl_img_link_photo)
    .filter((url): url is string => typeof url === "string");
}
