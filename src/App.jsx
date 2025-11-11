import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/user/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import CCDVHome from "./components/ccdv/CCDVHome";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


// import "./App.css";

import DashboardCcdv from './components/ccdv/DashboardCcdv-editID';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ccdv" element={<CCDVHome />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/ccdv/dashboard/:userId" element={<DashboardCcdv />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
