import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export const useAuthInit = () => {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    console.log("🔐 [useAuthInit] Хук викликано, планую initAuth через 100мс");
    const timer = setTimeout(() => {
      console.log("🔐 [useAuthInit] Виконую initAuth...");
      initAuth();
    }, 100);

    return () => {
      console.log("🔐 [useAuthInit] Очищаю таймер");
      clearTimeout(timer);
    };
  }, [initAuth]);
};
