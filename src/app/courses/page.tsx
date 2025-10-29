import React from "react";
import CoursesCatalog from "@/components/sections/CoursesSection/CoursesCatalog/CoursesCatalog";
import VideoInstruction from "@/components/VideoInstruction";

export default function CoursesPage() {
  return (
    <div>
      <CoursesCatalog />
      
      {/* Відео інструкція для курсів */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <VideoInstruction
            title="Відео про наші курси"
            description="Подивіться наше відео, щоб дізнатися більше про навчальний процес та методику"
            videoClassName="h-80 rounded-lg shadow-lg"
            showTitle={true}
            showDescription={true}
            controls={true}
            autoPlay={false}
            muted={false}
          />
        </div>
      </section>
    </div>
  );
}
