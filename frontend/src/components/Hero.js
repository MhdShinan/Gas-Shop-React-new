import React from "react";
import Marquee from "react-fast-marquee";
import Cover from "../assets/images/COVER.jpeg";
import Cover1 from "../assets/images/cover1.png";
import Cover2 from "../assets/images/cover2.jpeg";
import Cover3 from "../assets/images/cover4.jpeg";
import Cover4 from "../assets/images/COVER 3.jpeg";
import Cover5 from "../assets/images/COVER IMAGE.jpeg";
import Cover6 from "../assets/Gas/new1.png";

const HeroSection = () => {
  const images = [Cover, Cover1, Cover2, Cover3, Cover4, Cover5];

  return (
    <section className="relative h-[500px] overflow-hidden">
      {/* Uncomment and adjust background style if needed */}
      <div
  className="absolute inset-0 bg-center bg-no-repeat w-full h-full bg-contain sm:bg-75 lg:bg-cover"
  style={{
    backgroundImage: `url(${Cover6})`,
    backgroundAttachment: 'fixed',
  }}
/>

      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 flex flex-col justify-center items-center text-white px-4 h-full"></div>

      <div className="absolute bottom-16 left-0 right-0 z-20">
        <Marquee gradient={false} speed={50}>
          {images.map((image, index) => (
            <div key={index} className="mx-2">
              <img
                src={image || "/placeholder.svg"}
                alt={`Gas station image ${index + 1}`}
                className="h-40 w-60 object-cover rounded-lg"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default HeroSection;
