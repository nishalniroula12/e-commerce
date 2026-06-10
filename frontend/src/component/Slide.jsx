import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const Slide = () => {
  const banners = [
    {
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    },
    {
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    },
    {
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-4 px-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        loop
      >
        {banners.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              src={item.image}
              alt="Fashion Banner"
              className="w-full h-[320px] rounded-xl object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slide;