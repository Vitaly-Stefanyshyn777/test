"use client";
import React, { useState } from "react";
import { useCartStore, selectCartTotal } from "@/store/cart";
import { useCreateWcOrder } from "@/lib/useMutation";
import { useWcPaymentGatewaysQuery } from "@/components/hooks/useWpQueries";
import MapPickerModal from "@/components/sections/CheckoutSection/MapPickerModal/MapPickerModal";
import CheckoutHeader from "@/components/layout/CheckoutHeader/CheckoutHeader";
import CheckoutFooter from "@/components/layout/CheckoutFooter/CheckoutFooter";
import PersonalDataForm from "./PersonalDataForm";
import DeliveryForm from "./DeliveryForm";
import PaymentForm from "./PaymentForm";
import CommentForm from "./CommentForm";
import OrderSummary from "./OrderSummary";
import s from "./CheckoutSection.module.css";

export default function CheckoutSection() {
  const total = useCartStore(selectCartTotal);
  const safeTotal = total || 0;
  const itemsMap = useCartStore((st) => st.items);
  const items = Object.values(itemsMap);

  // Логування стану кошика (тільки для дебагу)
  // React.useEffect(() => {
  //   console.log("[CheckoutSection] 🛒 Стан кошика:", {
  //     total,
  //     safeTotal,
  //     itemsCount: items.length,
  //     itemsMap,
  //     items: items.map((item) => ({
  //       id: item.id,
  //       name: item.name,
  //       quantity: item.quantity,
  //       price: item.price,
  //     })),
  //   });
  // }, [total, items, itemsMap]);

  const createOrderMutation = useCreateWcOrder();
  const { data: paymentGateways = [] } = useWcPaymentGatewaysQuery();

  const [hasDifferentRecipient, setHasDifferentRecipient] = useState(false);
  const [deliveryType, setDeliveryType] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    recipientFirstName: "",
    recipientLastName: "",
    recipientPhone: "",
    city: "",
    branch: "",
    house: "",
    building: "",
    apartment: "",
    paymentMethod: "Накладений платіж",
    comment: "",
  });

  const handleSubmit = async () => {
    try {
      // Валідація email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Будь ласка, введіть валідну email адресу");
        return;
      }

      // console.log("[CheckoutSection] 🚀 Відправляю замовлення:", {
      //   formData,
      //   hasDifferentRecipient,
      //   deliveryType,
      //   itemsCount: items.length,
      // });

      // Мапінг платіжного методу
      const paymentMethodMap: Record<string, string> = {
        "Накладений платіж": "cod",
        "Онлайн-оплата WayForPay": "wayforpay",
        "Оплата при отриманні": "cod",
      };

      const paymentMethod = paymentMethodMap[formData.paymentMethod] || "cod";
      const paymentMethodTitle = formData.paymentMethod;

      // Підготовка даних для WooCommerce
      const orderData = {
        payment_method: paymentMethod,
        payment_method_title: paymentMethodTitle,
        set_paid: false,
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address_1: formData.branch || formData.house,
          city: formData.city,
          country: "UA",
        },
        shipping: {
          first_name: hasDifferentRecipient
            ? formData.recipientFirstName
            : formData.firstName,
          last_name: hasDifferentRecipient
            ? formData.recipientLastName
            : formData.lastName,
          address_1: formData.branch || formData.house,
          city: formData.city,
          country: "UA",
        },
        line_items: items.map((item) => ({
          product_id: parseInt(item.id),
          quantity: item.quantity,
        })),
        shipping_lines:
          deliveryType === "nova_poshta"
            ? [
                {
                  method_id: "nova_poshta",
                  method_title: "Нова Пошта",
                  total: "0.00",
                },
              ]
            : undefined,
        customer_note: formData.comment,
      };

      // console.log("[CheckoutSection] 📦 Дані замовлення:", orderData);
      // console.log("[CheckoutSection] 📦 Line items детально:", {
      //   lineItems: orderData.line_items,
      //   itemsFromCart: items.map((item) => ({
      //     id: item.id,
      //     name: item.name,
      //     quantity: item.quantity,
      //     price: item.price,
      //   })),
      // });

      // Відправка замовлення
      const result = (await createOrderMutation.mutateAsync(orderData)) as {
        id: number | string;
        status?: string;
      };

      // console.log("[CheckoutSection] ✅ Замовлення створено:", result);

      // Збереження даних для сторінки успіху
      localStorage.setItem(
        "orderData",
        JSON.stringify({
          formData,
          hasDifferentRecipient,
          deliveryType,
          orderId: result.id,
          orderStatus: result.status,
        })
      );

      // Перенаправлення на сторінку успіху
      window.location.href = "/order-success";
    } catch (error) {
      console.error(
        "[CheckoutSection] ❌ Помилка створення замовлення:",
        error
      );
      alert("Помилка створення замовлення. Спробуйте ще раз.");
    }
  };

  return (
    <>
      <CheckoutHeader />
      <div className={s.page}>
        <div className={s.container}>
          <div className={s.left}>
            <PersonalDataForm
              formData={formData}
              hasDifferentRecipient={hasDifferentRecipient}
              setFormData={setFormData}
              setHasDifferentRecipient={setHasDifferentRecipient}
            />

            <DeliveryForm
              deliveryType={deliveryType}
              formData={formData}
              setDeliveryType={setDeliveryType}
              setFormData={setFormData}
              setIsMapOpen={setIsMapOpen}
            />

            <PaymentForm formData={formData} setFormData={setFormData} />

            <CommentForm formData={formData} setFormData={setFormData} />

            <div className={s.buttonBlock}>
              <button
                className={s.primaryWide}
                onClick={handleSubmit}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending
                  ? "Обробка замовлення..."
                  : "Підтвердити замовлення"}
              </button>
              <div className={s.checkboxBlock}>
                <label className={s.checkbox}>
                  <input type="checkbox" />
                  <span className={s.checkboxText}>
                    Підписатись на e-mail розсилку
                  </span>
                </label>
              </div>
              <div className={s.checkboxBlock}>
                <label className={s.checkbox}>
                  <input type="checkbox" />
                  <span className={s.checkboxText}>
                    Приймаю умови оферти, політики конфіденційності та заяви про
                    обробку персональних даних
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className={s.right}>
            <OrderSummary total={safeTotal} />
          </div>
        </div>
      </div>
      <CheckoutFooter />
      <MapPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectLocation={(location) => {
          setFormData((prev) => ({ ...prev, branch: location }));
          setIsMapOpen(false);
        }}
        selectedCity={formData.city}
      />
    </>
  );
}
