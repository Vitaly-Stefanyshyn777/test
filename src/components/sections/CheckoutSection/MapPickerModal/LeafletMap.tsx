"use client";

import React from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import CustomMarker from "./CustomMarker";
import UserLocationMarker from "./UserLocationMarker";

type Warehouse = {
  name: string;
  position: { latitude: number; longitude: number };
  maxWeightPlaceSender?: number;
  maxWeightPlaceRecipient?: number;
  workSchedule: string;
};

type Props = {
  warehouses: Warehouse[];
  onSelect: (text: string) => void;
  center?: { lat: number; lng: number };
  locationRefreshTrigger?: number;
  userLocation?: { lat: number; lng: number } | null;
  onUserLocationFound?: (lat: number, lng: number) => void;
  shouldCenterOnUserLocation?: boolean;
};

function getWarehouseInfo(warehouse: Warehouse) {
  const isPostomat = warehouse.name.includes("Поштомат");
  const maxWeight =
    warehouse.maxWeightPlaceSender || warehouse.maxWeightPlaceRecipient || 0;
  const schedule = warehouse.workSchedule;

  if (isPostomat) {
    return {
      type: "Поштомат",
      isMobile: false,
      schedule,
      maxWeight,
      color: "#10b981",
      radius: 8,
      label: "П",
    };
  }

  const isMobile =
    schedule.includes("мобільне") || schedule.includes("автомобіль");
  const isFullBranch = maxWeight >= 200;
  const isPoint = maxWeight <= 30;
  return {
    type: isFullBranch ? "Відділення" : "Пункт приймання",
    isMobile,
    schedule,
    maxWeight,
    color: isFullBranch ? "#3b82f6" : "#f59e0b",
    radius: isFullBranch ? 7 : 6,
    label: isFullBranch ? "В" : "П",
  };
}

function ChangeView({
  center,
  userLocation,
}: {
  center?: { lat: number; lng: number };
  userLocation?: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  React.useEffect(() => {
    // Пріоритет: геолокація користувача > місто
    const targetLocation = userLocation || center;
    if (targetLocation) {
      map.setView(
        [targetLocation.lat, targetLocation.lng],
        map.getZoom() || 12
      );
    }
  }, [center, userLocation, map]);
  return null;
}

export default function LeafletMap({
  warehouses,
  onSelect,
  center,
  locationRefreshTrigger,
  userLocation,
  onUserLocationFound,
  shouldCenterOnUserLocation = false,
}: Props) {
  const hasCoords = warehouses.filter(
    (w) => w.position?.latitude && w.position?.longitude
  );

  // Пріоритет центрування: геолокація користувача > місто > перше відділення > Київ
  const mapCenter: LatLngExpression = userLocation
    ? [userLocation.lat, userLocation.lng]
    : center
    ? [center.lat, center.lng]
    : hasCoords.length
    ? [hasCoords[0].position.latitude, hasCoords[0].position.longitude]
    : [50.4501, 30.5234]; // Київ за замовчуванням

  return (
    <MapContainer
      center={mapCenter}
      zoom={12}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom
    >
      {center || userLocation ? (
        <ChangeView center={center} userLocation={userLocation} />
      ) : null}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {hasCoords.map((warehouse, idx) => (
        <CustomMarker key={idx} warehouse={warehouse} onSelect={onSelect} />
      ))}

      {/* Маркер поточної локації користувача */}
      {(() => {
        console.log("🔍 LeafletMap: Передаємо пропси до UserLocationMarker:", {
          locationRefreshTrigger,
          shouldCenterOnUserLocation,
          userLocation,
        });
        return null;
      })()}
      <UserLocationMarker
        onLocationFound={(lat, lng) => {
          console.log("📍 LeafletMap: Отримано геолокацію:", lat, lng);
          onUserLocationFound?.(lat, lng);
        }}
        onLocationError={(error) => {
          console.warn("⚠️ LeafletMap: Помилка геолокації:", error);
        }}
        refreshTrigger={locationRefreshTrigger}
        shouldCenter={shouldCenterOnUserLocation}
        userLocation={userLocation}
      />

      {/* Приклад Polyline (за потреби) */}
      {/* <Polyline positions={[[50.45, 30.52], [50.46, 30.62]]} pathOptions={{ color: '#6366f1' }} /> */}
    </MapContainer>
  );
}
