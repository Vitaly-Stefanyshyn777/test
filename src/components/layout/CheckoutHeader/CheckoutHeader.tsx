"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import s from "./CheckoutHeader.module.css";
import { LogoHeader, NumberHeader, EntranceIcon } from "../../Icons/Icons";

export default function CheckoutHeader() {
  const router = useRouter();

  const handleExit = () => {
    router.push("/");
  };

  return (
    <header className={s.header}>
      <div className={s.headerContent}>
        <div className={s.left}>
          <button className={s.exitBtn} onClick={handleExit}>
            <EntranceIcon />
            <span className={s.exitBtnText}>Вийти</span>
          </button>
        </div>

        <div className={s.logo}>
          <div className={s.LogoIcon}>
            <LogoHeader />
          </div>
          <Link href="/">
            <span className={s.logoTextOne}>B.F.B</span>
            <span className={s.logoText}>Fitness</span>
          </Link>
        </div>

        <div className={s.right}>
          <div className={s.phone}>
            <NumberHeader />
            <div className={s.contacts}>
              <p className={s.contactText}>Ми на зв&apos;язку:</p>
              <div className={s.phoneWrapper}>
                <a href="tel:+380443338598" className={s.phoneLink}>
                  +38 (044) 333 85 98
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
