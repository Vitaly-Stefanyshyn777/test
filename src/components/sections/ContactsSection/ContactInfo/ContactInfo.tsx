"use client";
import React from "react";
import s from "./ContactInfo.module.css";
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  WhatsappIcon,
} from "@/components/Icons/Icons";

const ContactInfo: React.FC = () => {
  return (
    <div className={s.contactInfo}>
      <div className={s.content}>
        <div className={s.titleTextBlock}>
          <h2 className={s.title}>Контакти</h2>
        </div>

        <div className={s.contactDetailsContainer}>
          <div className={s.contactDetailsBlock}>
            <div className={s.contactIcons}>
              <div className={s.socialIcons}>
                <div className={s.socialIconsContainer}>
                  <div className={s.socialIconBlock}>
                    <div className={s.socialIcon}>
                      <InstagramIcon />
                    </div>
                    <div className={s.socialIcon}>
                      <FacebookIcon />
                    </div>
                    <div className={s.socialIcon}>
                      <TelegramIcon />
                    </div>
                    <div className={s.socialIcon}>
                      <WhatsappIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={s.contactEmailNumber}>
              <p className={s.valueNumber}>+38 (99) 999 99 99</p>
              <span className={s.valueEmail}>bfb@gmail.com</span>
            </div>
          </div>

          <div className={s.contactAddressBlock}>
            <p className={s.valueAddress}>м. Мукачево, вул. Леся Курбаса 7</p>
            <div className={s.contactItem}>
              <p className={s.valueSchedule}>пн-пт: 09:00 - 22:00</p>
              <p className={s.valueSchedule}>сб-нд: 10:00 - 20:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
