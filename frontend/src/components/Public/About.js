import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './About.css';
import gymImage from '../../assets/yoga.png.jpeg'; // Rename to avoid double .jpg if needed

function About() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="about-section" id="about">
      <h2 className="section-title" data-aos="fade-up">ABOUT</h2>

      <div className="about-content">
        <img
          src={gymImage}
          alt="Elite Gym"
          className="about-image"
          data-aos="zoom-in-up"
        />

        <div className="about-text" data-aos="fade-left">
          <h2><span className="green-text">"UNIQUE ATMOSPHERE"</span></h2>
          <p>
            <em>
              ELITEFIT is more than just fitness — it’s a lifestyle transformation. Built on a passion for performance, community, and self-discipline, ELITEFIT helps you unlock your full potential through structured training, expert guidance, and a motivating environment. Whether you're a beginner or a seasoned athlete, our mission is to fuel your progress and elevate your results — physically and mentally.

Join the ELITEFIT movement. Stronger, together.
            </em>
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;