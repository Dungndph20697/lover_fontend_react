import React from "react";
import { useEffect, useState } from "react";
import { getTopLoverHome } from "../../service/top_lover_home/topCcdv";
import Header from "./layout/Header";
import HeroSection from "./layout/HeroSection";
import FeaturedLovers from "./FeaturedLovers";
import CallToAction from "./CallToAction";
import Footer from "./layout/Footer";

export default function Home() {
  const [lovers, setLovers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTopLoverHome();
        setLovers(data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    }

    fetchData();
  }, []);

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
