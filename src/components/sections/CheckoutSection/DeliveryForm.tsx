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
  const [isHouseExpanded, setIsHouseExpanded] = useState(false);
  const [isBuildingExpanded, setIsBuildingExpanded] = useState(false);
  const [isApartmentExpanded, setIsApartmentExpanded] = useState(false);

  // Функція для закриття всіх інших dropdown
  const closeOtherDropdowns = (currentDropdown: string) => {
    if (currentDropdown !== "delivery") setIsDeliveryExpanded(false);
    if (currentDropdown !== "city") setIsCityExpanded(false);
    if (currentDropdown !== "branch") setIsBranchExpanded(false);
    if (currentDropdown !== "house") setIsHouseExpanded(false);
    if (currentDropdown !== "building") setIsBuildingExpanded(false);
    if (currentDropdown !== "apartment") setIsApartmentExpanded(false);
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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // Завантаження міст з updated_data.json
  React.useEffect(() => {
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const response = await fetch("/updated_data.json");
        const data = await response.json();

        // Витягуємо унікальні міста
        const uniqueCities = data
          .map((city: any) => city.name)
          .filter(
            (name: string, index: number, arr: string[]) =>
              arr.indexOf(name) === index
          )
          .sort()
          .slice(0, 100) // Обмежуємо до 100 міст для продуктивності
          .map((name: string) => ({ value: name, label: name }));

        setCities(uniqueCities);
      } catch (error) {
        console.error("Помилка завантаження міст:", error);
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
        const selectedCity = data.find(
          (city: any) => city.name === formData.city
        );
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
          .map((warehouse: any) => ({
            value: warehouse.name,
            label: warehouse.name
              .replace(/Пункт приймання-видачі \(до \d+ кг\): /, "")
              .replace(/Поштомат "Нова Пошта" №\d+: /, "Поштомат: "),
          }))
          .slice(0, 50); // Обмежуємо до 50 для продуктивності

        setBranches(branchesList);
      } catch (error) {
        console.error("Помилка завантаження відділень:", error);
        setBranches([]);
      } finally {
        setLoadingBranches(false);
      }
    };

    loadBranches();
  }, [formData.city]);

  const houses = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];

  const buildings = [
    { value: "А", label: "А" },
    { value: "Б", label: "Б" },
    { value: "В", label: "В" },
    { value: "Г", label: "Г" },
    { value: "Д", label: "Д" },
  ];

  const apartments = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
  ];

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
            <>
              <div className={s.inputWrap}>
                <div
                  className={s.inputWithIcons}
                  onClick={() => {
                    closeOtherDropdowns("house");
                    setIsHouseExpanded(!isHouseExpanded);
                  }}
                >
                  <span className={s.inputText}>
                    {formData.house
                      ? houses.find((house) => house.value === formData.house)
                          ?.label
                      : "Будинок"}
                  </span>
                  <span
                    className={`${s.iconRight} ${
                      isHouseExpanded ? s.rotated : ""
                    }`}
                  >
                    <ChevronUpIcon />
                  </span>
                </div>
                {isHouseExpanded && (
                  <div
                    className={`${s.dropdownList} ${
                      houses.length > 3 ? s.scrollable : ""
                    }`}
                  >
                    {houses.map((house) => (
                      <div
                        key={house.value}
                        className={s.dropdownItem}
                        onClick={() => {
                          setFormData({ ...formData, house: house.value });
                          setIsHouseExpanded(false);
                        }}
                      >
                        <span className={s.dropdownText}>{house.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={s.inputWrap}>
                <div
                  className={s.inputWithIcons}
                  onClick={() => {
                    closeOtherDropdowns("building");
                    setIsBuildingExpanded(!isBuildingExpanded);
                  }}
                >
                  <span className={s.inputText}>
                    {formData.building
                      ? buildings.find(
                          (building) => building.value === formData.building
                        )?.label
                      : "Корпус"}
                  </span>
                  <span
                    className={`${s.iconRight} ${
                      isBuildingExpanded ? s.rotated : ""
                    }`}
                  >
                    <ChevronUpIcon />
                  </span>
                </div>
                {isBuildingExpanded && (
                  <div
                    className={`${s.dropdownList} ${
                      buildings.length > 3 ? s.scrollable : ""
                    }`}
                  >
                    {buildings.map((building) => (
                      <div
                        key={building.value}
                        className={s.dropdownItem}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            building: building.value,
                          });
                          setIsBuildingExpanded(false);
                        }}
                      >
                        <span className={s.dropdownText}>{building.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={s.inputWrap}>
                <div
                  className={s.inputWithIcons}
                  onClick={() => {
                    closeOtherDropdowns("apartment");
                    setIsApartmentExpanded(!isApartmentExpanded);
                  }}
                >
                  <span className={s.inputText}>
                    {formData.apartment
                      ? apartments.find(
                          (apartment) => apartment.value === formData.apartment
                        )?.label
                      : "Квартира"}
                  </span>
                  <span
                    className={`${s.iconRight} ${
                      isApartmentExpanded ? s.rotated : ""
                    }`}
                  >
                    <ChevronUpIcon />
                  </span>
                </div>
                {isApartmentExpanded && (
                  <div
                    className={`${s.dropdownList} ${
                      apartments.length > 3 ? s.scrollable : ""
                    }`}
                  >
                    {apartments.map((apartment) => (
                      <div
                        key={apartment.value}
                        className={s.dropdownItem}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            apartment: apartment.value,
                          });
                          setIsApartmentExpanded(false);
                        }}
                      >
                        <span className={s.dropdownText}>
                          {apartment.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
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
