"use client";

import React from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import s from "./UserLocationMarker.module.css";

type Props = {
  onLocationFound?: (lat: number, lng: number) => void;
  onLocationError?: (error: string) => void;
  refreshTrigger?: number; // Зовнішній тригер для оновлення локації
  shouldCenter?: boolean; // Чи потрібно центрувати карту на геолокації
  userLocation?: { lat: number; lng: number } | null; // Зовнішня геолокація
};

// Компонент для керування центром карти
function MapController({
  userLocation,
  shouldCenter,
}: {
  userLocation: { lat: number; lng: number } | null;
  shouldCenter: boolean;
}) {
  const map = useMap();
  const [hasCentered, setHasCentered] = React.useState(false);

  React.useEffect(() => {
    if (userLocation && shouldCenter && !hasCentered) {
      // Додаємо невелику затримку для стабільності
      const timer = setTimeout(() => {
        map.setView([userLocation.lat, userLocation.lng], 15, {
          animate: true,
          duration: 1.0, // Зменшуємо до 1 секунди
        });
        setHasCentered(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [map, userLocation, shouldCenter, hasCentered]);

  // Скидаємо стан при зміні локації
  React.useEffect(() => {
    setHasCentered(false);
  }, [userLocation]);

  return null;
}

export default function UserLocationMarker({
  onLocationFound,
  onLocationError,
  refreshTrigger,
  shouldCenter = false,
  userLocation: externalUserLocation,
}: Props) {
  console.log("🔍 UserLocationMarker: Компонент завантажується");
  const [userLocation, setUserLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Використовуємо CircleMarker замість іконки

  // Отримуємо геолокацію користувача
  const getUserLocation = React.useCallback(() => {
    console.log("🚀 UserLocationMarker: Запитуємо геолокацію");
    if (!navigator.geolocation) {
      const errorMsg = "Геолокація не підтримується цим браузером";
      console.log("❌ UserLocationMarker:", errorMsg);
      setError(errorMsg);
      onLocationError?.(errorMsg);
      return;
    }

    console.log("📍 UserLocationMarker: Запитуємо геолокацію у браузера");
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };

        console.log("🎯 UserLocationMarker: Отримано геолокацію:", location);
        setUserLocation(location);
        setIsLoading(false);
        onLocationFound?.(latitude, longitude);
      },
      (error) => {
        let errorMessage = "Не вдалося отримати геолокацію";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Доступ до геолокації заборонено";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Інформація про місцезнаходження недоступна";
            break;
          case error.TIMEOUT:
            errorMessage = "Час очікування геолокації вичерпано";
            break;
        }

        setError(errorMessage);
        setIsLoading(false);
        onLocationError?.(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 хвилин
      }
    );
  }, [onLocationFound, onLocationError]);

  // Не автоматично запитуємо геолокацію - тільки при зовнішньому тригері

  // Оновлюємо локацію при зміні refreshTrigger
  React.useEffect(() => {
    console.log(
      "🔄 UserLocationMarker: useEffect refreshTrigger:",
      refreshTrigger
    );
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      console.log(
        "⏰ UserLocationMarker: Запускаємо таймер для запиту геолокації"
      );
      // Додаємо невелику затримку для стабільності
      const timer = setTimeout(() => {
        console.log(
          "⏰ UserLocationMarker: Таймер спрацював, запитуємо геолокацію"
        );
        getUserLocation();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [refreshTrigger, getUserLocation]);

  // Використовуємо зовнішню userLocation якщо вона є
  const currentUserLocation = externalUserLocation || userLocation;

  // Створюємо кастомну іконку для геолокації користувача
  const userLocationIcon = React.useMemo(() => {
    console.log(
      "🎨 UserLocationMarker: Створюємо іконку з Frame-1321317309.svg"
    );

    const icon = new Icon({
      iconUrl: "/Frame-1321317309.svg",
      iconSize: [40, 40], // Розмір іконки
      iconAnchor: [20, 40], // Точка якоря внизу іконки
      popupAnchor: [0, -40], // Зміщення попапу
    });

    console.log("🎨 UserLocationMarker: Icon створена:", icon);
    return icon;
  }, []);

  // Додаємо діагностику стану
  console.log("🔍 UserLocationMarker: Стан компонента:", {
    userLocation: currentUserLocation,
    externalUserLocation,
    internalUserLocation: userLocation,
    isLoading,
    error,
    refreshTrigger,
    shouldCenter,
  });

  // Додаткова діагностика координат
  console.log("📍 UserLocationMarker: Координати для маркера:", {
    lat: currentUserLocation?.lat,
    lng: currentUserLocation?.lng,
    isValid:
      currentUserLocation &&
      typeof currentUserLocation.lat === "number" &&
      typeof currentUserLocation.lng === "number" &&
      !isNaN(currentUserLocation.lat) &&
      !isNaN(currentUserLocation.lng),
  });

  return (
    <>
      {/* Контролер карти для переходу до координат користувача */}
      <MapController
        userLocation={currentUserLocation}
        shouldCenter={shouldCenter}
      />

      {/* Показуємо маркер тільки якщо є локація */}
      {currentUserLocation ? (
        <>
          {console.log(
            "📍 UserLocationMarker: Відображаємо маркер на",
            currentUserLocation
          )}
          {console.log(
            "📍 UserLocationMarker: Використовуємо іконку Frame-1321317309.svg"
          )}
          {/* Marker з кастомною іконкою для геолокації користувача */}
          <Marker
            position={[currentUserLocation.lat, currentUserLocation.lng]}
            icon={userLocationIcon}
            key={`user-location-${currentUserLocation.lat}-${currentUserLocation.lng}`} // Додаємо key для примусового оновлення
            eventHandlers={{
              add: () => {
                console.log(
                  "✅ UserLocationMarker: Marker з іконкою додано на карту з координатами:",
                  currentUserLocation
                );
              },
              remove: () => {
                console.log(
                  "❌ UserLocationMarker: CircleMarker видалено з карти"
                );
              },
            }}
          >
            <Popup>
              <div className={s.popupContainer}>
                <strong>Ваше місцезнаходження</strong>
                <div className={s.coordinates}>
                  {currentUserLocation.lat.toFixed(6)},{" "}
                  {currentUserLocation.lng.toFixed(6)}
                </div>
                {isLoading && (
                  <div className={s.loading}>Оновлення локації...</div>
                )}
                {error && <div className={s.error}>{error}</div>}
              </div>
            </Popup>
          </Marker>
        </>
      ) : (
        console.log(
          "❌ UserLocationMarker: currentUserLocation є null, маркер не відображається"
        )
      )}
    </>
  );
}
