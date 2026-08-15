import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { getAllTestimonials } from '@/src/services/api';
import { TestimonialCard } from './TestimonialCard';
import { STATIC_TESTIMONIALS } from '@/src/data/testimonials';
import type { Testimonial } from '@/src/types';

export const TestimonialsSlider: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    // Real approved customer reviews come from the API. Only when there are
    // none (fresh deployment / empty database) do we fall back to clearly
    // badged demo testimonials so the section is never empty. The two are
    // never mixed together.
    getAllTestimonials()
      .then((data) => {
        if (cancelled) return;
        setTestimonials(data.length > 0 ? data : STATIC_TESTIMONIALS);
      })
      .catch(() => {
        if (!cancelled) setTestimonials(STATIC_TESTIMONIALS);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
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
        {!isLoading &&
          testimonials.map((t) => (
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