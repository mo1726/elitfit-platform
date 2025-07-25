import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';       // <-- Required AOS styles

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import './Activities.css';

import img1 from '../../assets/activity1.jpg';
import img2 from '../../assets/download (31).jpeg';
import img3 from '../../assets/activity3.jpg';
import img4 from '../../assets/activity4.jpg';

const activities = [
  {
    image: img1,
    title: 'Musculation',
    description:
      'Build power and definition with musculation at EliteFit. Elevate your strength training with top-tier equipment and expert guidance to achieve visible results.',
  },
  {
    image: img2,
    title: 'Yoga',
    description:
      'Find balance and strength with Yoga at EliteFit. Reconnect body and mind through guided flows that improve flexibility and core stability.',
  },
  {
    image: img3,
    title: 'Boxing',
    description:
      'Unleash your power with Boxing at EliteFit. Step into the ring for explosive cardio, technical drills, and real combat skills that sculpt a fighter’s physique.',
  },
  {
    image: img4,
    title: 'Pilates',
    description:
      'Strengthen and lengthen with Pilates at EliteFit. Develop core control, posture, and functional flexibility in every session.',
  },
];

function Activities() {
  // ✅ Initialise AOS once on mount
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="activities-clean" id='activities'>
      <h2 className="section-title" data-aos="fade-up">
        ACTIVITIES
      </h2>

      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        loop
        speed={2000}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
          reverseDirection: true,
        }}
        modules={[Autoplay]}
        grabCursor
        breakpoints={{
          320: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="clean-swiper"
      >
        {activities.map((act, index) => (
          <SwiperSlide key={index}>
            <div className="clean-slide" data-aos="zoom-in">
              <img src={act.image} alt={act.title} />
              <div className="overlay">
                <div className="slide-title">{act.title}</div>
                <p className="slide-description">{act.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Activities;