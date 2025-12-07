import React, { useEffect, useRef, useState } from "react";
import { ThemeSettingsPost } from "@/lib/bfbApi";
import Image from "next/image";
import styles from "./TrainerMap.module.css";
import { TrainerUser } from "../types";
import InstructingSlider from "../../InstructingSlider/InstructingSlider";
import { useThemeSettingsQuery } from "@/components/hooks/useWpQueries";

type LeafletNS = {
  map: (element: HTMLElement) => TrainerLeafletMap;
  tileLayer: (
    url: string,
    options: Record<string, unknown>
  ) => TrainerLeafletTileLayer;
  marker: (
    coords: [number, number],
    options?: { icon?: unknown }
  ) => TrainerLeafletMarker;
  icon: (options: {
    iconUrl: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
    popupAnchor: [number, number];
  }) => unknown;
  latLngBounds?: (coords: [number, number][]) => unknown;
  Marker?: unknown;
};

interface TrainerLeafletMap {
  setView: (coords: [number, number], zoom: number) => TrainerLeafletMap;
  remove: () => void;
  eachLayer?: (cb: (layer: unknown) => void) => void;
  fitBounds?: (
    bounds: unknown,
    options?: { padding?: [number, number]; maxZoom?: number }
  ) => void;
}

interface TrainerLeafletTileLayer {
  addTo: (map: TrainerLeafletMap | unknown) => TrainerLeafletTileLayer;
}

interface TrainerLeafletMarker {
  addTo: (map: unknown) => TrainerLeafletMarker;
  bindPopup: (content: string) => TrainerLeafletMarker;
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
  const mapInstanceRef = useRef<TrainerLeafletMap | null>(null);
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
    // 1) Пробуємо галерею з theme_settings (hl_data_gallery)
    const ts0 = themeSettings?.[0] as ThemeSettingsPost | undefined;
    const themeGallery =
      (ts0?.acf?.hl_data_gallery as
        | Array<{ hl_img_link_photo?: string[] }>
        | undefined) ||
      ((
        ts0 as unknown as {
          hl_data_gallery?: Array<{ hl_img_link_photo?: string[] }>;
        }
      )?.hl_data_gallery as
        | Array<{ hl_img_link_photo?: string[] }>
        | undefined);
    if (Array.isArray(themeGallery) && themeGallery.length > 0) {
      return themeGallery.map(
        (item) =>
          (item?.hl_img_link_photo?.[0] as string) ||
          "https://via.placeholder.com/400x300/f0f0f0/666?text=Зал"
      );
    }

    // 2) Якщо немає в theme_settings — використовуємо галерею тренера
    if (trainer?.hl_data_gallery && trainer.hl_data_gallery.length > 0) {
      return trainer.hl_data_gallery.map(
        (galleryItem: GalleryItem) =>
          galleryItem.hl_img_link_photo[0] ||
          "https://via.placeholder.com/400x300/f0f0f0/666?text=Зал"
      );
    }

    // 3) Фолбек
    return [
      "https://via.placeholder.com/400x300/f0f0f0/666?text=Зал",
      "https://via.placeholder.com/400x300/f0f0f0/666?text=Зал",
    ];
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
          const L = (window as unknown as { L: LeafletNS }).L;
          if (mapRef.current && L && !mapInstanceRef.current) {
            // Ініціалізуємо карту навіть без даних

            // Функція для створення кастомної іконки тренера (як в Contacts TrainerMap)
            function createTrainerIcon() {
              return L.icon({
                iconUrl: "/images/Colour.svg",
                iconSize: [150, 150],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40],
              });
            }

            const map = L.map(mapRef.current).setView([48.3794, 31.1656], 6);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "© OpenStreetMap contributors",
              maxZoom: 19,
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
              const allCoords: Array<[number, number]> = [];
              effectiveMarkers.forEach((markerGroup) => {
                markerGroup.coordinates?.forEach((coord) => {
                  // Перевірка, що coord має правильний формат [number, number]
                  if (
                    coord &&
                    coord.length === 2 &&
                    typeof coord[0] === "number" &&
                    typeof coord[1] === "number"
                  ) {
                    const coordTuple: [number, number] = [coord[0], coord[1]];
                    allCoords.push(coordTuple);
                    const marker = L.marker(coordTuple, {
                      icon: createTrainerIcon(),
                    }) as unknown as {
                      addTo: (m: unknown) => unknown;
                      bindPopup: (s: string) => unknown;
                    };
                    marker.addTo(map);
                    marker.bindPopup(
                      `<div style="min-width: 180px; text-align: center;">
                        <strong>${markerGroup.title}</strong>
                        <div style="font-size: 12px; margin-top: 4px; color: #64748b;">
                          Координати: ${coord[0].toFixed(
                            6
                          )}, ${coord[1].toFixed(6)}
                        </div>
                      </div>`
                    );
                  }
                });
              });

              // Зумлення до маркера (як в Contacts TrainerMap)
              try {
                if (allCoords.length === 1) {
                  map.setView(allCoords[0], 18);
                } else if (allCoords.length > 1 && L.latLngBounds) {
                  const bounds = L.latLngBounds(allCoords);
                  if (map.fitBounds) {
                    map.fitBounds(bounds, {
                      padding: [32, 32],
                      maxZoom: 18,
                    });
                  }
                }
              } catch {}
            } else {
              // Якщо немає координат, карта залишається порожньою, але видимою
            }
          }
        };

        document.head.appendChild(script);
      } catch {
        // Silent error handling
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
      mapInstanceRef.current.eachLayer?.((layer: unknown) => {
        // немає строгих типів для Leaflet layer у цій обгортці
        const markerCtor = (window as unknown as { L: LeafletNS }).L.Marker;
        if (markerCtor && (layer as unknown) instanceof (markerCtor as never)) {
          (
            mapInstanceRef.current as unknown as {
              removeLayer: (l: unknown) => void;
            }
          ).removeLayer(layer);
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
        const allCoords: Array<[number, number]> = [];
        effectiveMarkers.forEach((markerGroup) => {
          markerGroup.coordinates?.forEach((coord) => {
            // Перевірка, що coord має правильний формат [number, number]
            if (
              coord &&
              coord.length === 2 &&
              typeof coord[0] === "number" &&
              typeof coord[1] === "number"
            ) {
              const coordTuple: [number, number] = [coord[0], coord[1]];
              allCoords.push(coordTuple);
              const L = (window as unknown as { L: LeafletNS }).L;
              const marker = L.marker(coordTuple, {
                icon: L.icon({
                  iconUrl: "/images/Colour.svg",
                  iconSize: [150, 150],
                  iconAnchor: [20, 40],
                  popupAnchor: [0, -40],
                }),
              }) as unknown as {
                addTo: (m: unknown) => unknown;
                bindPopup: (s: string) => unknown;
              };
              marker.addTo(mapInstanceRef.current as unknown);
              marker.bindPopup(
                `<div style="min-width: 180px; text-align: center;">
                  <strong>${markerGroup.title}</strong>
                  <div style="font-size: 12px; margin-top: 4px; color: #64748b;">
                    Координати: ${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}
                  </div>
                </div>`
              );
            }
          });
        });

        // Зумлення до маркера (як в Contacts TrainerMap)
        try {
          if (mapInstanceRef.current) {
            const L = (window as unknown as { L: LeafletNS }).L;
            if (allCoords.length === 1) {
              mapInstanceRef.current.setView(allCoords[0], 18);
            } else if (allCoords.length > 1 && L && L.latLngBounds) {
              const bounds = L.latLngBounds(allCoords);
              mapInstanceRef.current.fitBounds?.(bounds, {
                padding: [32, 32],
                maxZoom: 18,
              });
            }
          }
        } catch {}
      } else {
        // Якщо немає координат, карта залишається порожньою, але видимою
      }
    }
  }, [themeMapMarkers, mapMarkers, trainer, trainer?.my_wlocation]);

  return (
    <div id="locations" className={styles.container}>
      {trainer?.hl_data_contact && trainer.hl_data_contact.length > 0 && (
        <div className={styles.contactsSection}>
          <h4 className={styles.contactsTitle}>Контакти</h4>
          <div className={styles.socialIconsMobile}>
            {trainer.hl_data_contact.map(
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
            )}
          </div>
        </div>
      )}
      <h3 className={styles.title}>Місця проведення тренувань</h3>
      <div className={styles.mapContainer}>
        <div ref={mapRef} className={styles.map} />

        {trainer && (
          <div className={styles.locationCard}>
            <div className={styles.locationImages}>
              {(() => {
                const previews = getGalleryImages().slice(0, 3);
                if (previews.length === 0) {
                  return (
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
                  );
                }
                return previews.map((src, index) => (
                  <div
                    key={index}
                    className={styles.imageWrapper}
                    onClick={() => openGallery(index)}
                  >
                    <Image
                      src={src}
                      alt="Фото залу"
                      width={160}
                      height={160}
                      unoptimized={src.startsWith(
                        "https://via.placeholder.com"
                      )}
                      onError={(e) => {
                        try {
                          (e.currentTarget as HTMLImageElement).src =
                            "/images/location-placeholder.svg";
                        } catch {}
                      }}
                      className={styles.locationImage}
                    />
                  </div>
                ));
              })()}
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
                        "+380 95 437 25 75"}
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.label}>Час роботи у вихідні:</span>
                    <span className={styles.value}>
                      {trainer.my_wlocation?.[0]?.hl_input_text_schedule_two ||
                        "10:00 - 20:00"}
                    </span>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>
                      {trainer.input_text_email ||
                        trainer.my_wlocation?.[0]?.hl_input_text_email ||
                        "bfb.board.ukraine@gmail.com"}
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

            {trainer.hl_data_contact && trainer.hl_data_contact.length > 0 && (
              <div className={styles.locationSocial}>
                {trainer.hl_data_contact.map(
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
                )}
              </div>
            )}
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
