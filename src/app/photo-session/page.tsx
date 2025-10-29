import PhotoOneBlock from "@/components/sections/PhotoSession/PhotoOneBlock/PhotoOneBlock";
import PhotoTwoBlock from "@/components/sections/PhotoSession/PhotoTwoBlock/PhotoTwoBlock";
import PhotoThreeBlock from "@/components/sections/PhotoSession/PhotoThreeBlock/PhotoThreeBlock";
import PhotoFourBlock from "@/components/sections/PhotoSession/PhotoFourBlock/PhotoFourBlock";
import PhotoFiveBlock from "@/components/sections/PhotoSession/PhotoFiveBlock/PhotoFiveBlock";
import PhotoSixBlock from "@/components/sections/PhotoSession/PhotoSixBlock/PhotoSixBlock";
import PhotoSevenBlock from "@/components/sections/PhotoSession/PhotoSevenBlock/PhotoSevenBlock";
import PhotoEightBlock from "@/components/sections/PhotoSession/PhotoEightBlock/PhotoEightBlock";
import PhotoNineBlock from "@/components/sections/PhotoSession/PhotoNineBlock/PhotoNineBlock";
import PhotoTenBlock from "@/components/sections/PhotoSession/PhotoTenBlock/PhotoTenBlock";
import VideoInstruction from "@/components/VideoInstruction";

export default function PhotoSessionPage() {
  return (
    <div>
      <PhotoOneBlock />
      <PhotoTwoBlock />
      <PhotoThreeBlock />
      <PhotoFourBlock />
      <PhotoFiveBlock />
      <PhotoSixBlock />
      <PhotoSevenBlock />
      <PhotoEightBlock />
      <PhotoNineBlock />
      <PhotoTenBlock />
      
      {/* Відео інструкція */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <VideoInstruction
            title="Відео інструкція для фотосесії"
            description="Подивіться наше відео, щоб дізнатися більше про процес фотосесії та підготовку"
            videoClassName="h-96 rounded-lg shadow-lg"
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
