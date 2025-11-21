import React from "react";
import { useEffect, useState } from "react";
import { getTopLoverHome, getTopViewedLoverHome } from "../../service/top_lover_home/topCcdv";
import Header from "./layout/Header";
import HeroSection from "./layout/HeroSection";
import FeaturedLovers from "./FeaturedLovers";
import CallToAction from "./CallToAction";
import Footer from "./layout/Footer";
import TopLovers from "./TopLovers";
import VipSuggestionList from "../user/VipSuggestionList";

export default function Home() {
  const [lovers, setLovers] = useState([]);
  const [topLovers, setTopLovers] = useState([]);

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

  useEffect(() => {
    async function fetchTopViewedLovers() {
      try {
        const data = await getTopViewedLoverHome();
        setTopLovers(data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    }

    fetchTopViewedLovers();
  }, []);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      <HeroSection />
      <TopLovers lovers={topLovers}/>
      <VipSuggestionList />
      <FeaturedLovers lovers={lovers} />
      <CallToAction />
      <Footer />
    </div>
  );
}
