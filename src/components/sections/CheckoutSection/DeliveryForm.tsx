"use client";
import React, { useState } from "react";
import { NovaPoshtaIcon, ChevronUpIcon } from "@/components/Icons/Icons";
import { FormData } from "./types";
import s from "./CheckoutSection.module.css";

interface DeliveryFormProps {
  deliveryType: string;
  formData: FormData;
  setDeliveryType: (value: string) => void;
  setFormData: (data: FormData) => void;
  setIsMapOpen: (value: boolean) => void;
}

export default function DeliveryForm({
  deliveryType,
  formData,
  setDeliveryType,
  setFormData,
  setIsMapOpen,
}: DeliveryFormProps) {
  const [isDeliveryExpanded, setIsDeliveryExpanded] = useState(false);
  const [isCityExpanded, setIsCityExpanded] = useState(false);
  const [isBranchExpanded, setIsBranchExpanded] = useState(false);

  // Функція для закриття всіх інших dropdown
  const closeOtherDropdowns = (currentDropdown: string) => {
    if (currentDropdown !== "delivery") setIsDeliveryExpanded(false);
    if (currentDropdown !== "city") setIsCityExpanded(false);
    if (currentDropdown !== "branch") setIsBranchExpanded(false);
  };

  const deliveryOptions = [
    { value: "branch", label: "На відділення" },
    { value: "cargo", label: "Грузове відділення" },
    { value: "courier", label: "Курʼєр" },
  ];

  const [cities, setCities] = React.useState<
    Array<{ value: string; label: string }>
  >([]);
  const [loadingCities, setLoadingCities] = React.useState(false);

  // Завантаження міст з updated_data.json
  React.useEffect(() => {
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const response = await fetch("/updated_data.json");
        const data = await response.json();

        // Витягуємо унікальні міста
        const uniqueCities = (data as Array<{ name?: string }>)
          .map((city) => city.name || "")
          .filter(
            (name: string, index: number, arr: string[]) =>
              arr.indexOf(name) === index
          )
          .sort()
          .slice(0, 100) // Обмежуємо до 100 міст для продуктивності
          .map((name: string) => ({ value: name, label: name }));

        setCities(uniqueCities);
      } catch (error) {
        // Silent error handling
        // Fallback до статичних міст
        setCities([
          { value: "Київ", label: "Київ" },
          { value: "Чернігів", label: "Чернігів" },
          { value: "Львів", label: "Львів" },
        ]);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, []);

  const [branches, setBranches] = React.useState<
    Array<{ value: string; label: string }>
  >([]);
  const [loadingBranches, setLoadingBranches] = React.useState(false);

  // Завантаження відділень для обраного міста
  React.useEffect(() => {
    if (!formData.city) {
      setBranches([]);
      return;
    }

    const loadBranches = async () => {
      setLoadingBranches(true);
      try {
        const response = await fetch("/updated_data.json");
        const data = await response.json();

        // Знаходимо місто
        const selectedCity = (data as Array<{
          name?: string;
          branches?: Array<{ name: string }>;
          postomats?: Array<{ name: string }>;
          warehouses?: Array<{ name: string }>;
        }>).find((city) => city.name === formData.city);
        if (!selectedCity) {
          setBranches([]);
          return;
        }

        // Витягуємо всі відділення та поштомати
        const allWarehouses = [
          ...(selectedCity.branches || []),
          ...(selectedCity.postomats || []),
          ...(selectedCity.warehouses || []),
        ];

        const branchesList = allWarehouses
          .map((warehouse: { name: string }) => ({
            value: warehouse.name,
            label: warehouse.name
              .replace(/Пункт приймання-видачі \(до \d+ кг\): /, "")
              .replace(/Поштомат "Нова Пошта" №\d+: /, "Поштомат: "),
          }))
          .slice(0, 50); // Обмежуємо до 50 для продуктивності

        setBranches(branchesList);
      } catch (error) {
        // Silent error handling
        setBranches([]);
      } finally {
        setLoadingBranches(false);
      }
    };

    loadBranches();
  }, [formData.city]);

  return (
    <div className={s.deliveryBlock}>
      <h2 className={s.sectionTitle}>Доставка</h2>
      <div className={s.deliveryGrid}>
        <div className={s.deliveryRow}>
          <div className={s.inputWrap}>
            <div
              className={s.inputWithIconsNova}
              onClick={() => {
                closeOtherDropdowns("delivery");
                setIsDeliveryExpanded(!isDeliveryExpanded);
              }}
            >
              <span className={s.inputText}>
                {deliveryType
                  ? deliveryOptions.find((opt) => opt.value === deliveryType)
                      ?.label
                  : "Обери спосіб доставки"}
              </span>
              <span className={s.iconLeft}>
                <NovaPoshtaIcon />
              </span>
              <span
                className={`${s.iconRight} ${
                  isDeliveryExpanded ? s.rotated : ""
                }`}
              >
                <ChevronUpIcon />
              </span>
            </div>
            {isDeliveryExpanded && (
              <div
                className={`${s.dropdownList} ${
                  deliveryOptions.length > 3 ? s.scrollable : ""
                }`}
              >
                {deliveryOptions.map((option) => (
                  <div
                    key={option.value}
                    className={s.dropdownItem}
                    onClick={() => {
                      setDeliveryType(option.value);
                      setIsDeliveryExpanded(false);
                    }}
                  >
                    <span className={s.iconLeft}>
                      <NovaPoshtaIcon />
                    </span>
                    <span className={s.dropdownText}>{option.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={s.inputWrap}>
            <div
              className={s.inputWithIcons}
              onClick={() => {
                closeOtherDropdowns("city");
                setIsCityExpanded(!isCityExpanded);
              }}
            >
              <span className={s.inputText}>
                {loadingCities
                  ? "Завантаження міст..."
                  : formData.city
                  ? cities.find((city) => city.value === formData.city)?.label
                  : "Місто"}
              </span>
              <span
                className={`${s.iconRight} ${isCityExpanded ? s.rotated : ""}`}
              >
                <ChevronUpIcon />
              </span>
            </div>
            {isCityExpanded && cities.length > 0 && (
              <div
                className={`${s.dropdownList} ${
                  cities.length > 3 ? s.scrollable : ""
                }`}
              >
                {cities.map((city) => (
                  <div
                    key={city.value}
                    className={s.dropdownItem}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        city: city.value,
                        branch: "",
                      }); // Очищуємо відділення при зміні міста
                      setIsCityExpanded(false);
                    }}
                  >
                    <span className={s.dropdownText}>{city.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={s.deliveryRow}>
          <div className={s.inputWrapBranch}>
            <div
              className={s.inputWithIcons}
              onClick={() => {
                if (!formData.city) {
                  alert("Спочатку оберіть місто");
                  return;
                }
                closeOtherDropdowns("branch");
                setIsBranchExpanded(!isBranchExpanded);
              }}
            >
              <span className={s.inputText}>
                {loadingBranches
                  ? "Завантаження..."
                  : formData.branch
                  ? branches.find((branch) => branch.value === formData.branch)
                      ?.label
                  : !formData.city
                  ? "Спочатку оберіть місто"
                  : "На відділення"}
              </span>
              <span
                className={`${s.iconRight} ${
                  isBranchExpanded ? s.rotated : ""
                }`}
              >
                <ChevronUpIcon />
              </span>
            </div>
            {isBranchExpanded && branches.length > 0 && (
              <div
                className={`${s.dropdownList} ${
                  branches.length > 3 ? s.scrollable : ""
                }`}
              >
                {branches.map((branch) => (
                  <div
                    key={branch.value}
                    className={s.dropdownItem}
                    onClick={() => {
                      setFormData({ ...formData, branch: branch.value });
                      setIsBranchExpanded(false);
                    }}
                  >
                    <span className={s.dropdownText}>{branch.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {deliveryType === "courier" && (
            <div className={s.addressFields}>
              <div className={`${s.inputWrap} ${s.inputWrapHouse}`}>
                <input
                  className={s.input}
                  type="text"
                  placeholder="Будинок"
                  value={formData.house}
                  onChange={(e) =>
                    setFormData({ ...formData, house: e.target.value })
                  }
                />
              </div>
              <div className={`${s.inputWrap} ${s.inputWrapBuilding}`}>
                <input
                  className={s.input}
                  type="text"
                  placeholder="Корпус"
                  value={formData.building}
                  onChange={(e) =>
                    setFormData({ ...formData, building: e.target.value })
                  }
                />
              </div>
              <div className={`${s.inputWrap} ${s.inputWrapApartment}`}>
                <input
                  className={s.input}
                  type="text"
                  placeholder="Квартира"
                  value={formData.apartment}
                  onChange={(e) =>
                    setFormData({ ...formData, apartment: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          {deliveryType !== "courier" && (
            <button
              className={s.primary}
              onClick={() => setIsMapOpen(true)}
              disabled={!formData.city}
            >
              Обрати на мапі
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
