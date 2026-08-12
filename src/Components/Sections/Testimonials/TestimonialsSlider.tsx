import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { getAllTestimonials } from '../../../services/api';
import { TestimonialCard } from './TestimonialCard';
import type { Testimonial } from '../../../types';

export const TestimonialsSlider: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    getAllTestimonials()
      .then((data) => setTestimonials(data))
      .catch(() => setTestimonials([]));
  }, []);

  return (
    <div className="mt-8 md:mt-12 testimonials-slider">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        slidesPerGroup={1}
        spaceBetween={24}
        loop={false}
        speed={700}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true, el: '.testimonials-pagination' }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        wrapperClass="!items-stretch"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id} className="!h-auto">
            <TestimonialCard t={t} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="testimonials-pagination  flex items-center justify-center gap-2 mt-6 md:mt-8" />
    </div>
  );
};

export default TestimonialsSlider;