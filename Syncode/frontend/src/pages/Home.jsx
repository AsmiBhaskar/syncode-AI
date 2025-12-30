import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Security } from "@/components/home/Security";
import { Comaparasion } from "@/components/home/Comparasion";

const Home = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark">
      {/* Navbar*/}
      <Navbar />

      <main>
        <HeroSection />
        <div id="comparison">
          <Comaparasion />
        </div>
        <div id="features">
          <Features />
        </div>
        <div id="howitworks">
          <HowItWorks />
        </div>
        <div id="security">
          <Security />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
