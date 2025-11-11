import React from "react";

export default function Sidebar({ selected, setSelected }) {
  return (
    <div className="bg-light vh-100 p-3 border-end" style={{ width: "220px" }}>
      <h5 className="text-danger fw-bold mb-4">Chức năng</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <button
            className={`btn w-100 text-start ${
              selected === "userinfo"
                ? "btn-danger text-white"
                : "btn-outline-danger"
            }`}
            onClick={() => setSelected("userinfo")}
          >
            Thông tin cá nhân
          </button>
        </li>
        <li className="nav-item mb-2">
          <button
            className={`btn w-100 text-start ${
              selected === "services"
                ? "btn-danger text-white"
                : "btn-outline-danger"
            }`}
            onClick={() => setSelected("services")}
          >
            Dịch vụ của tôi
          </button>
        </li>
        <li className="nav-item mb-2">
          <button
            className={`btn w-100 text-start ${
              selected === "quanlydon"
                ? "btn-danger text-white"
                : "btn-outline-danger"
            }`}
            onClick={() => setSelected("quanlydon")}
          >
            Quản lý đơn
          </button>
        </li>
      </ul>
    </div>
  );
}
