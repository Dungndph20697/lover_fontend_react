import React, { useEffect, useState } from "react";
import Header from "./layout/Header";
import HeroSection from "./layout/HeroSection";
import FeaturedLovers from "./FeaturedLovers";
import CallToAction from "./CallToAction";
import Footer from "./layout/Footer";

import { getLatestProviders } from "../../service/providerService";



export default function Home() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    getLatestProviders()
      .then((data) => {
        console.log("Providers:", data);
        setProviders(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      <HeroSection />
      <FeaturedLovers lovers={providers} />
      <CallToAction />
      <Footer />
    </div>
  );
}