import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/user/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import QuanLiDonThue from "./components/quan_li_don_thue/QuanLiDonThue";
import CCDVHome from "./components/ccdv/CCDVHome";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
<<<<<<< HEAD
          <Route path="/quanLiDonThue" element={<QuanLiDonThue />} />
=======
          <Route path="/ccdv" element={<CCDVHome />} />
>>>>>>> 6fc702ba5f7f6b4c6c29872bbc68a63657d21517
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
