import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Membership.css";
import membershipService from "../../services/membershipService";

function Membership() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 100,
      mirror: true,
    });

    membershipService
      .getAllPlans()
      .then((res) => setPlans(res.data))
      .catch((err) => console.error("Error fetching membership plans:", err));
  }, []);

  return (
    <section className="membership-section" id="membership">
      <h2 className="section-title" data-aos="fade-up">
        Membership
      </h2>
      <div className="membership-cards">
        {plans.length === 0 ? (
          <p className="text-center text-gray-400">
            No membership plans available.
          </p>
        ) : (
          plans.map((plan, index) => (
            <div
              className="membership-card"
              key={plan.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="plan-header">
                <h3 className="plan-title">{plan.name}</h3>
                <div className="plan-price">{plan.price} MAD</div>
              </div>

              <ul className="plan-features">
                {plan.description
                  ?.split(".")
                  .filter((feature) => feature.trim().length > 0) // remove empty items if any
                  .map((feature, i) => (
                    <li key={i}>
                      <span className="check-icon">✔</span> {feature.trim()}
                    </li>
                  ))}
              </ul>

              <button className="membership-btn">Join Now</button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Membership;
