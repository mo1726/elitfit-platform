import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <section className="contact-section">
      <div className="contact-content">
        <div className="contact-info">
          <h2>Contact Us</h2>
          <p>📍 EliteFit Gym, Casablanca, Morocco</p>
          <p>📞 +212 6 1234 5678</p>
          <p>📧 contact@elitefit.com</p>
        </div>
        <div className="contact-map">
          <iframe
            title="EliteFit Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.9951211784086!2d-7.620447684798108!3d33.5862450494677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cdcf09fffd05%3A0x6b3c12a5c06dbecf!2sCasablanca!5e0!3m2!1sfr!2sma!4v1684780987654!5m2!1sfr!2sma"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default Contact;