import HeroSection from "@/components/sections/HeroSection";
import AchievmentsSection from "@/components/sections/AchievmentsSection/AchievmentsSection";
import TargetAuditorySection from "@/components/sections/TargetAuditorySection/TargetAuditorySection";
import CalculateSection from "@/components/sections/CalculateSection/CalculateSection";
import LearningFormats from "@/components/sections/AboutBFBSection/LearningFormats/LearningFormats";
import BoardSection from "@/components/sections/BoardSection/BoardSection";
import CoursesShowcase from "@/components/sections/CoursesSection/CoursesShowcase/CoursesShowcase";
import ProductsShowcase from "@/components/sections/ProductsSection/ProductsShowcase/ProductsShowcase";
import EventsSection from "@/components/sections/EventsSection/EventsSection";
import Founder from "@/components/sections/AboutBFBSection/Founder/Founder";
import InstructorAdvantages from "@/components/sections/InstructorAdvantages/InstructorAdvantages";
import ContactsSection from "@/components/sections/ContactsSection/ContactsSection";
export default function Home() {
  return (
    <>
      <HeroSection />
      <AchievmentsSection />
      <TargetAuditorySection />
      <CalculateSection />
      <div className="py-[100px]">
        <LearningFormats />
      </div>
      <BoardSection />
      <CoursesShowcase />
      <EventsSection />
      <div className="py-[100px]">
        <Founder />
      </div>
      <InstructorAdvantages />
      <div className="py-[100px]">
        <ContactsSection />
      </div>
      <ProductsShowcase />
    </>
  );
}
