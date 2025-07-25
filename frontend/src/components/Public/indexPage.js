import React from "react";
import Navbar from "../Layout/Navbar";
import HomePage from "./HomePage";
import About from './About';
import Activities from './activities';
import Membership from './MembershipPlans';
import Contact from './Contact';



function IndexPage() {
  return (
    <>
      <Navbar/>
      <HomePage/>
      <About/>
        <Activities/>
        <Membership/>
        <Contact/>
    </>
  );
}

export default IndexPage;