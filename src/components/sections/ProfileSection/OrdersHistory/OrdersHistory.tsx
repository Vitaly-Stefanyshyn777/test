"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import styles from "./OrdersHistory.module.css";
import PaginationNav from "@/components/ui/PaginationNav/PaginationNav";
import { useAuthStore } from "@/store/auth";
import { adminRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface WCOrderItem {
  id: number;
  name: string;
  quantity: number;
  total: string;
  product_id?: number;
}

interface WCOrder {
  id: number;
  status: string;
  date_created?: string;
  number?: string;
  total?: string;
  line_items?: WCOrderItem[];
}

type ViewOrder = {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  orderDate: string;
  orderNumber: string;
  status: "delivered" | "processing" | "cancelled";
  totalPrice: number;
};

const OrdersHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;
  const user = useAuthStore((s) => s.user);
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const path = `/wp-json/wc/v3/orders?customer=${encodeURIComponent(
        String(user?.id)
      )}`;
      const { data } = await adminRequest({
        method: "GET",
        url: "/api/proxy",
        params: { path },
      });
      return (data as WCOrder[]).map((o) => {
        const first = (o.line_items || [])[0];
        const total = Number(o.total || first?.total || 0);
        const created = o.date_created ? new Date(o.date_created) : null;
        return {
          id: String(o.id),
          productName: first?.name || "Товар",
          productImage: "/placeholder.png",
          quantity: first?.quantity || 1,
          orderDate: created ? created.toLocaleDateString("uk-UA") : "",
          orderNumber: o.number ? `№${o.number}` : `#${o.id}`,
          status:
            o.status === "completed"
              ? "delivered"
              : o.status === "cancelled"
              ? "cancelled"
              : "processing",
          totalPrice: isNaN(total) ? 0 : total,
        } as ViewOrder;
      });
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(orders.length / ordersPerPage)),
    [orders.length]
  );

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Доставлено";
      case "processing":
        return "Обробляється";
      case "cancelled":
        return "Скасовано";
      default:
        return "Невідомо";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "delivered":
        return styles.delivered;
      case "processing":
        return styles.processing;
      case "cancelled":
        return styles.cancelled;
      default:
        return "";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRepeatOrder = (orderId: string) => {
    console.log("Повторити замовлення:", orderId);
  };

  const handleViewProduct = (orderId: string) => {
    console.log("Переглянути товар:", orderId);
  };

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Історія усіх замовлень</h1>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.ordersList}>
        {(orders.length ? orders : [])
          .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
          .map((order, index) => (
            <React.Fragment key={order.id}>
              <div className={styles.orderCard}>
                <div className={styles.productImage}>
                  <Image
                    src={order.productImage}
                    alt={order.productName}
                    width={80}
                    height={80}
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div className={styles.orderDetails}>
                  <div className={styles.leftSectionBlock}>
                    <div className={styles.productInfo}>
                      <div className={styles.productInfoBlock}>
                        <h3 className={styles.productName}>
                          {order.productName}
                        </h3>
                        <span className={styles.quantity}>
                          x{order.quantity}
                        </span>
                      </div>

                      <div className={styles.orderMeta}>
                        <span className={styles.orderDate}>
                          {order.orderDate}
                        </span>
                        <span className={styles.orderNumber}>
                          {order.orderNumber}
                        </span>
                        {/* <span
                      className={`${styles.status} ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span> */}
                      </div>
                    </div>
                    <span
                      className={`${styles.status} ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className={styles.orderSummary}>
                    <div className={styles.totalPrice}>
                      <span className={styles.totalLabel}>
                        Сума замовлення:
                      </span>
                      <span className={styles.price}>{order.totalPrice}₴</span>
                    </div>
                  </div>

                  <div className={styles.rightSection}>
                    {/* <div className={styles.orderSummary}>
                  <div className={styles.totalPrice}>
                    <span className={styles.totalLabel}>Сума замовлення:</span>
                    <span className={styles.price}>{order.totalPrice}₴</span>
                  </div>
                </div> */}

                    <div className={styles.orderActions}>
                      <button
                        className={styles.repeatBtn}
                        onClick={() => handleRepeatOrder(order.id)}
                      >
                        Повторити замовлення
                      </button>
                      <button
                        className={styles.productBtn}
                        onClick={() => handleViewProduct(order.id)}
                      >
                        Сторінка товару
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {index < Math.min(ordersPerPage, orders.length) - 1 && (
                <div className={styles.divider}></div>
              )}
            </React.Fragment>
          ))}
        {isLoading && <div style={{ padding: 12 }}>Завантаження...</div>}
        {!isLoading && !orders.length && !isError && (
          <div style={{ padding: 12 }}>Замовлень ще немає</div>
        )}
        {!isLoading && isError && (
          <div className={styles.error}>Не вдалося завантажити замовлення</div>
        )}
      </div>

      <div className={styles.pagination}>
        <PaginationNav
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

export default OrdersHistory;
