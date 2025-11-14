import React from "react";
import Header from "./layout/Header";
import HeroSection from "./layout/HeroSection";
import FeaturedLovers from "./FeaturedLovers";
import CallToAction from "./CallToAction";
import Footer from "./layout/Footer";

export default function Home() {
  const lovers = [
    {
      id: 1,
      name: "Linh",
      age: 22,
      city: "Hà Nội",
      image: "https://i.pravatar.cc/300?img=47",
    },
    {
      id: 2,
      name: "Huy",
      age: 25,
      city: "TP.HCM",
      image: "https://i.pravatar.cc/300?img=12",
    },
    {
      id: 3,
      name: "My",
      age: 21,
      city: "Đà Nẵng",
      image: "https://i.pravatar.cc/300?img=32",
    },
  ];

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      <HeroSection />
      <FeaturedLovers lovers={lovers} />
      <CallToAction />
      <Footer />
    </div>
  );
}
