import React from "react";
import { useEffect, useState } from "react";
import {
  getTopLoverHome,
  getTopViewedLoverHome,
} from "../../service/top_lover_home/topCcdv";
import Header from "./layout/Header";
import HeroSection from "./layout/HeroSection";
import FeaturedLovers from "./FeaturedLovers";
import CallToAction from "./CallToAction";
import Footer from "./layout/Footer";
import TopLovers from "./TopLovers";
import { findUserByToken } from "../../service/user/login";

export default function Home() {
  const [lovers, setLovers] = useState([]);
  const [topLovers, setTopLovers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const data = await findUserByToken(token);
        setCurrentUser(data);
      } catch (e) {
        console.log("Không lấy được user đăng nhập");
      }
    };

    loadCurrentUser();
  }, []);

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
      <TopLovers lovers={topLovers} currentUser={currentUser} />
      <FeaturedLovers lovers={lovers} currentUser={currentUser} />
      <CallToAction />
      <Footer />
    </div>
  );
}
