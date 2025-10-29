"use client";
import React from "react";
import styles from "./ContactSupport.module.css";

import ContactHeader from "./ContactHeader";
import ContactInfoBlock from "./ContactInfoBlock";
import SocialIconsBlock from "./SocialIconsBlock";
import WorkingHoursBlock from "./WorkingHoursBlock";
import MapBlock from "./MapBlock";
interface ContactInfo {
  phone: string;
  email: string;
}

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
}

interface WorkingHours {
  weekdays: string;
  weekends: string;
}

interface ContactSupportProps {
  title?: string;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  workingHours?: WorkingHours;
  address?: string;
  mapUrl?: string;
}

const defaultContactInfo: ContactInfo = {
  phone: "+38 (99) 999 99 99",
  email: "bfb@gmail.com",
};

const defaultSocialLinks: SocialLink[] = [
  {
    name: "Instagram",
    icon: () => null,
    url: "https://instagram.com/bfbfitness",
  },
  { name: "Telegram", icon: () => null, url: "https://t.me/bfbfitness" },
  {
    name: "Facebook",
    icon: () => null,
    url: "https://facebook.com/bfbfitness",
  },
  { name: "WhatsApp", icon: () => null, url: "https://wa.me/380999999999" },
];

const defaultWorkingHours: WorkingHours = {
  weekdays: "09:00 - 22:00",
  weekends: "10:00 - 20:00",
};

const ContactSupport: React.FC<ContactSupportProps> = ({
  title = "Контакти і підтримка",
  contactInfo = defaultContactInfo,
  socialLinks = defaultSocialLinks,
  workingHours = defaultWorkingHours,
  address = "м. Мукачево, вул. Леся Курбаса 7",
  mapUrl = "#",
}) => {
  const handleSocialClick = (url: string) => {
    if (url !== "#") {
      window.open(url, "_blank");
    }
  };

  const handleMapClick = () => {
    if (mapUrl !== "#") {
      window.open(mapUrl, "_blank");
    }
  };

  return (
    <div className={styles.contactSupport}>
      <ContactHeader title={title} />
      <div className={styles.contactGrid}>
        <ContactInfoBlock phone={contactInfo.phone} email={contactInfo.email} />
        <SocialIconsBlock
          onClick={handleSocialClick}
          links={socialLinks.map((l) => ({ name: l.name, url: l.url }))}
        />
        <WorkingHoursBlock
          weekdays={workingHours.weekdays}
          weekends={workingHours.weekends}
          address={address}
        />
        <MapBlock onClick={handleMapClick} />
      </div>
    </div>
  );
};

export default ContactSupport;
