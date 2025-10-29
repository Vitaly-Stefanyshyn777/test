/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./TrainerMap.module.css";
import { TrainerUser } from "../types";
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  WhatsappIcon,
} from "@/components/Icons/Icons";
import InstructingSlider from "../../InstructingSlider/InstructingSlider";
import { useThemeSettingsQuery } from "@/components/hooks/useWpQueries";

declare global {
  interface Window {
    L: {
      map: (element: HTMLElement) => LeafletMap;
      tileLayer: (
        url: string,
        options: Record<string, unknown>
      ) => LeafletTileLayer;
      marker: (coords: [number, number]) => LeafletMarker;
    };
  }
}

interface LeafletMap {
  setView: (coords: [number, number], zoom: number) => LeafletMap;
  remove: () => void;
}

interface LeafletTileLayer {
  addTo: (map: LeafletMap) => LeafletTileLayer;
}

interface LeafletMarker {
  addTo: (map: LeafletMap) => LeafletMarker;
  bindPopup: (content: string) => LeafletMarker;
}

interface MapMarker {
  title: string;
  coordinates: [number, number][];
}

interface TrainerMapProps {
  mapMarkers?: MapMarker[];
  trainer?: TrainerUser;
}

interface GalleryItem {
  hl_img_link_photo: string[];
}

interface ContactItem {
  hl_input_text_link?: string;
  hl_img_svg_icon: string;
}

export default function TrainerMap({ mapMarkers, trainer }: TrainerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Отримуємо дані з API
  const { data: themeSettings } = useThemeSettingsQuery();
  const themeMapMarkers = themeSettings?.[0]?.acf?.map_markers;

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setIsSliderOpen(true);
  };

  const closeGallery = () => {
    setIsSliderOpen(false);
  };

  const getGalleryImages = () => {
    if (trainer?.hl_data_gallery && trainer.hl_data_gallery.length > 0) {
      const images = trainer.hl_data_gallery.map(
        (galleryItem: GalleryItem) =>
          galleryItem.hl_img_link_photo[0] ||
          "https://via.placeholder.com/400x300/f0f0f0/666?text=Зал"
      );
      return images;
    }

    const fallbackImages = [
      "https://via.placeholder.com/400x300/f0f0f0/666?text=Зал",
      "https://via.placeholder.com/400x300/f0f0f0/666?text=Зал",
    ];
    return fallbackImages;
  };

  useEffect(() => {
    const loadMap = async () => {
      try {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
        link.crossOrigin = "";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.integrity =
          "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
        script.crossOrigin = "";

        script.onload = () => {
          if (mapRef.current && window.L && !mapInstanceRef.current) {
            const L = window.L;

            // Ініціалізуємо карту навіть без даних

            // Функція для створення кастомної іконки тренера
            function createTrainerIcon() {
              return L.icon({
                iconUrl: "/Frame-1321317314.svg",
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40],
              });
            }

            const map = L.map(mapRef.current).setView([48.3794, 31.1656], 6);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "© OpenStreetMap contributors",
            }).addTo(map);

            mapInstanceRef.current = map;

            // Отримуємо координати з my_wlocation тренера
            const myWlocationMarkers: MapMarker[] = [];
            if (trainer?.my_wlocation) {
              trainer.my_wlocation.forEach(
                (location: Record<string, unknown>) => {
                  // Шукаємо координати в різних можливих полях
                  const lat =
                    location?.hl_input_text_coord_lat ||
                    location?.coord_lat ||
                    location?.latitude ||
                    (location as { lat?: number })?.lat;
                  const lng =
                    location?.hl_input_text_coord_ln ||
                    location?.coord_lng ||
                    location?.longitude ||
                    (location as { lng?: number })?.lng;
                  if (lat && lng) {
                    myWlocationMarkers.push({
                      title: String(
                        (location as { hl_input_text_title?: unknown })
                          ?.hl_input_text_title ?? "Місце проведення"
                      ),
                      coordinates: [
                        [parseFloat(String(lat)), parseFloat(String(lng))],
                      ],
                    });
                  }
                }
              );
            }

            // Пріоритет: my_wlocation > themeMapMarkers > mapMarkers
            const effectiveMarkers =
              myWlocationMarkers.length > 0
                ? myWlocationMarkers
                : themeMapMarkers || mapMarkers;

            // Додаємо маркери тільки якщо є координати
            if (effectiveMarkers && effectiveMarkers.length > 0) {
              effectiveMarkers.forEach((markerGroup) => {
                markerGroup.coordinates?.forEach((coord) => {
                  const marker = L.marker([coord[0], coord[1]], {
                    icon: createTrainerIcon(),
                  }).addTo(map as any);
                  marker.bindPopup(
                    `<div style="min-width: 180px; text-align: center;">
                      <strong>${markerGroup.title}</strong>
                      <div style="font-size: 12px; margin-top: 4px; color: #64748b;">
                        Координати: ${coord[0].toFixed(6)}, ${coord[1].toFixed(
                      6
                    )}
                      </div>
                    </div>`
                  );
                });
              });
            } else {
              // Якщо немає координат, карта залишається порожньою, але видимою
              console.log(
                "🗺️ TrainerMap: Немає координат для відображення маркерів"
              );
            }
          }
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error("Помилка завантаження карти:", error);
      }
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [mapMarkers, themeMapMarkers, trainer?.my_wlocation]);

  // Окремий useEffect для оновлення маркерів, коли дані завантажуються
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Очищаємо існуючі маркери
      (mapInstanceRef.current as any).eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker) {
          (mapInstanceRef.current as any)?.removeLayer(layer);
        }
      });

      // Отримуємо координати з my_wlocation тренера
      const myWlocationMarkers: MapMarker[] = [];
      if (trainer?.my_wlocation) {
        trainer.my_wlocation.forEach((location: Record<string, unknown>) => {
          // Шукаємо координати в різних можливих полях
          const lat =
            location?.hl_input_text_coord_lat ||
            location?.coord_lat ||
            location?.latitude ||
            location?.lat;
          const lng =
            location?.hl_input_text_coord_ln ||
            location?.coord_lng ||
            location?.longitude ||
            location?.lng;
          if (lat && lng) {
            myWlocationMarkers.push({
              title: String(
                (location as { hl_input_text_title?: unknown })
                  ?.hl_input_text_title ?? "Місце проведення"
              ),
              coordinates: [[parseFloat(String(lat)), parseFloat(String(lng))]],
            });
          }
        });
      }

      // Пріоритет: my_wlocation > themeMapMarkers > mapMarkers
      const effectiveMarkers =
        myWlocationMarkers.length > 0
          ? myWlocationMarkers
          : themeMapMarkers || mapMarkers;
      // Додаємо маркери тільки якщо є координати
      if (effectiveMarkers && effectiveMarkers.length > 0) {
        effectiveMarkers.forEach((markerGroup) => {
          markerGroup.coordinates?.forEach((coord) => {
            const marker = window.L.marker([coord[0], coord[1]], {
              icon: window.L.icon({
                iconUrl: "/Frame-1321317314.svg",
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40],
              }),
            }).addTo(mapInstanceRef.current as any);
            marker.bindPopup(
              `<div style="min-width: 180px; text-align: center;">
                <strong>${markerGroup.title}</strong>
                <div style="font-size: 12px; margin-top: 4px; color: #64748b;">
                  Координати: ${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}
                </div>
              </div>`
            );
          });
        });
      } else {
        // Якщо немає координат, карта залишається порожньою, але видимою
        console.log("🗺️ TrainerMap: Немає координат для відображення маркерів");
      }
    }
  }, [themeMapMarkers, mapMarkers, trainer, trainer?.my_wlocation]);

  return (
    <div id="locations" className={styles.container}>
      <h3 className={styles.title}>Місця проведення тренувань</h3>
      <div className={styles.mapContainer}>
        <div ref={mapRef} className={styles.map} />

        {trainer && (
          <div className={styles.locationCard}>
            <div className={styles.locationImages}>
              {trainer.hl_data_gallery && trainer.hl_data_gallery.length > 0 ? (
                trainer.hl_data_gallery
                  .slice(0, 2)
                  .map((galleryItem: GalleryItem, index: number) => (
                    <div
                      key={index}
                      className={styles.imageWrapper}
                      onClick={() => openGallery(index)}
                    >
                      <Image
                        src={
                          galleryItem.hl_img_link_photo[0] ||
                          "https://via.placeholder.com/160x160/f0f0f0/666?text=Зал"
                        }
                        alt="Фото залу"
                        width={160}
                        height={160}
                        className={styles.locationImage}
                      />
                    </div>
                  ))
              ) : (
                <>
                  <div
                    className={styles.imageWrapper}
                    onClick={() => openGallery(0)}
                  >
                    <Image
                      src="https://via.placeholder.com/160x160/f0f0f0/666?text=Зал"
                      alt="Фото залу"
                      width={160}
                      height={160}
                      className={styles.locationImage}
                    />
                  </div>
                  <div
                    className={styles.imageWrapper}
                    onClick={() => openGallery(1)}
                  >
                    <Image
                      src="https://via.placeholder.com/160x160/f0f0f0/666?text=Зал"
                      alt="Фото залу"
                      width={160}
                      height={160}
                      className={styles.locationImage}
                    />
                  </div>
                </>
              )}
            </div>
            <h3>
              {trainer.my_wlocation?.[0]?.hl_input_text_title ||
                trainer.my_experience?.[0]?.hl_input_text_gym ||
                "The alfa elit fitness"}
            </h3>
            <div className={styles.locationInfoCont}>
              <div className={styles.locationInfo}>
                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Телефон:</span>
                    <span className={styles.value}>
                      {trainer.input_text_phone ||
                        trainer.my_wlocation?.[0]?.hl_input_text_phone ||
                        trainer.social_phone ||
                        "+38 (99) 999 99 99"}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>
                      {trainer.input_text_email ||
                        trainer.my_wlocation?.[0]?.hl_input_text_email ||
                        "bfb@gmail.com"}
                    </span>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Час роботи у вихідні:</span>
                    <span className={styles.value}>
                      {trainer.my_wlocation?.[0]?.hl_input_text_schedule_two ||
                        "10:00 - 20:00"}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Час роботи у будні:</span>
                    <span className={styles.value}>
                      {trainer.my_wlocation?.[0]?.hl_input_text_schedule_five ||
                        "09:00 - 22:00"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.infoItemCenter}>
                <span className={styles.label}>Адреса:</span>
                <span className={styles.value}>
                  {trainer.input_text_address ||
                    trainer.my_wlocation?.[0]?.hl_input_text_address ||
                    `${trainer.location_city || "м. Київ"}, ${
                      trainer.location_country || "Україна"
                    }`}
                </span>
              </div>
            </div>

            <div className={styles.locationSocial}>
              {trainer.hl_data_contact && trainer.hl_data_contact.length > 0 ? (
                trainer.hl_data_contact.map(
                  (contact: ContactItem, index: number) => (
                    <a
                      key={index}
                      href={contact.hl_input_text_link || "#"}
                      className={styles.socialIcon}
                      dangerouslySetInnerHTML={{
                        __html: contact.hl_img_svg_icon,
                      }}
                    />
                  )
                )
              ) : (
                <>
                  <div className={styles.IconsBlock}>
                    <InstagramIcon />
                  </div>
                  <div className={styles.IconsBlock}>
                    <FacebookIcon />
                  </div>
                  <div className={styles.IconsBlock}>
                    <TelegramIcon />
                  </div>
                  <div className={styles.IconsBlock}>
                    <WhatsappIcon />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {(() => {
        // Отримуємо координати з my_wlocation тренера
        const myWlocationMarkers: MapMarker[] = [];
        if (trainer?.my_wlocation) {
          trainer.my_wlocation.forEach((location: Record<string, unknown>) => {
            const lat = (location as { hl_input_text_coord_lat?: unknown })
              ?.hl_input_text_coord_lat as unknown;
            const lng = (location as { hl_input_text_coord_ln?: unknown })
              ?.hl_input_text_coord_ln as unknown;
            if (lat && lng) {
              myWlocationMarkers.push({
                title: String(
                  (location as { hl_input_text_title?: unknown })
                    ?.hl_input_text_title ?? "Місце проведення"
                ),
                coordinates: [
                  [parseFloat(String(lat)), parseFloat(String(lng))],
                ],
              });
            }
          });
        }

        // Пріоритет: my_wlocation > mapMarkers
        const effectiveMarkers =
          myWlocationMarkers.length > 0 ? myWlocationMarkers : mapMarkers;

        return effectiveMarkers && effectiveMarkers.length > 0;
      })()}
      <InstructingSlider
        images={getGalleryImages()}
        isOpen={isSliderOpen}
        onClose={closeGallery}
        initialIndex={selectedImageIndex}
      />
    </div>
  );
}
