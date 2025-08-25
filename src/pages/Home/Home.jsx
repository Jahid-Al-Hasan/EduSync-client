import React from "react";
import Banner from "../../components/Banner/Banner.jsx";
import StudySessions from "./HomeComponents/StudySessions.jsx";
import WhyChooseUs from "./HomeComponents/WhyChooseUs.jsx";
import Testimonials from "./HomeComponents/Testimonials.jsx";
import HowItWorks from "./HomeComponents/HowItWorks.jsx";

const Home = () => {
  return (
    <div>
      <Banner />
      <WhyChooseUs />
      <StudySessions />
      <HowItWorks />
      <Testimonials />
    </div>
  );
};

export default Home;
