import React, { useState } from "react";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import UserInfo from "./UserInfo";
import Services from "./Services";
import QuanLyDon from "./QuanLyDon";
import Footer from "./layout/Footer";

import CcdvTopCustomers from "./lichsudathue/CcdvTopCustomers";

import PersonalInfoForm from "./PersonalProfile";
import RevenueForm from "./TongDoanhThu";


export default function CCDVDashboard() {
  const [selected, setSelected] = useState("userinfo");

  const renderContent = () => {
    switch (selected) {
      case "userinfo":
        return <UserInfo />;
      case "services":
        return <Services />;
      case "quanlydon":
        return <QuanLyDon />;
      case "personalInfo":
        return <PersonalInfoForm />;

      case "lichsuthue":
        return <CcdvTopCustomers />;

      case "revenueForm":
        return <RevenueForm />;
      default:
        return <UserInfo />;
    }
  };

  return (
    <>
      <Header />
      <div className="d-flex">
        <Sidebar selected={selected} setSelected={setSelected} />
        <div className="flex-grow-1 p-4">{renderContent()}</div>
      </div>
      <Footer />
    </>
  );
}
