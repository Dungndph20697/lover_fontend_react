import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/CcdvTopCustomers.css";

import UserDetailModal from "./UserDetailModal";

import {
  findTop3Requent,
  findTop3Recent,
  getfullinfouser,
} from "../../../service/ccdv/ccdvLichSuThue";

function formatName(user) {
  if (!user) return "";
  return user.nickname ? user.nickname : `${user.firstName} ${user.lastName}`;
}

export default function CcdvTopCustomers() {
  const [topFrequent, setTopFrequent] = useState([]);
  const [topRecent, setTopRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState(null);

  // 🔥 Gọi API lấy detail profile khi bấm nút XEM
  const handleView = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const data = await getfullinfouser(token, userId);

      setProfile(data);
      console.log(data);
      setShowModal(true);
    } catch (err) {
      console.error("Lỗi lấy profile:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user"));
        const ccdvId = userData?.id;

        let [frequent, recent] = await Promise.all([
          findTop3Requent(token, ccdvId),
          findTop3Recent(token, ccdvId),
        ]);

        // 🔥 Thêm avatar bằng cách gọi getfullinfouser cho từng user
        frequent = await Promise.all(
          frequent.map(async (item) => {
            try {
              const full = await getfullinfouser(token, item.user.id);
              return { ...item, avatar: full?.avatar || null };
            } catch {
              return { ...item, avatar: null };
            }
          })
        );

        recent = await Promise.all(
          recent.map(async (item) => {
            try {
              const full = await getfullinfouser(token, item.user.id);
              return { ...item, avatar: full?.avatar || null };
            } catch {
              return { ...item, avatar: null };
            }
          })
        );

        setTopFrequent(frequent);
        setTopRecent(recent);
      } catch (err) {
        console.error("Lỗi API:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="loading-text">Đang tải dữ liệu...</div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4" style={{ color: "#e64980" }}>
        💗 Thống kê khách thuê của bạn
      </h2>

      <div className="row g-4">
        {/* ---------- TOP FREQUENT ---------- */}
        <div className="col-lg-6">
          <div
            className="shadow-sm p-0"
            style={{
              borderRadius: "18px",
              background: "white",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#ff6b9d",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 className="text-white fw-semibold m-0">
                🌸 Top khách thuê nhiều nhất
              </h5>

              <span
                style={{
                  background: "white",
                  color: "#e64980",
                  fontWeight: "600",
                  padding: "4px 10px",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              >
                Số lần thuê
              </span>
            </div>

            <div className="p-3">
              {topFrequent.length === 0 ? (
                <p className="text-muted">Chưa có dữ liệu.</p>
              ) : (
                topFrequent.map((item, index) => (
                  <div
                    key={item.user.id}
                    className="d-flex align-items-center p-3 mb-3"
                    style={{
                      borderRadius: "14px",
                      background: "#fff5fa",
                      transition: "0.2s",
                    }}
                  >
                    {/* Avatar */}
                    <div style={{ marginRight: 14 }}>
                      <img
                        src={
                          item.avatar
                            ? item.avatar
                            : "https://ui-avatars.com/api/?name=" +
                            formatName(item.user)
                        }
                        alt="avatar"
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #ff9ecf, #ff6b9d)",
                          color: "white",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontWeight: "700",
                          marginRight: 14,
                          fontSize: "18px",
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-grow-1">
                      <div className="fw-semibold">
                        {index + 1} {formatName(item.user)}
                      </div>
                      <div className="text-muted small">
                        {item.user.firstName} {item.user.lastName} ·{" "}
                        {item.user.phone}
                      </div>
                    </div>

                    {/* Actions + Count */}
                    <div className="text-end">
                      {/* <button
                        className="btn btn-sm btn-outline-pink me-2"
                        onClick={() => handleView(item.user.id)}
                      >
                        Xem
                      </button> */}

                      <div
                        className="fw-bold"
                        style={{ color: "#d6336c", fontSize: "18px" }}
                      >
                        {item.hireCount} lần thuê
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ---------- TOP RECENT ---------- */}
        <div className="col-lg-6">
          <div
            className="shadow-sm p-0"
            style={{
              borderRadius: "18px",
              background: "white",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#74c69d",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 className="text-white fw-semibold m-0">
                🌿 Top khách thuê gần đây
              </h5>

              <span
                style={{
                  background: "white",
                  color: "#2b8a3e",
                  fontWeight: "600",
                  padding: "4px 10px",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              >
                Thời gian
              </span>
            </div>

            <div className="p-3">
              {topRecent.length === 0 ? (
                <p className="text-muted">Không có dữ liệu gần đây.</p>
              ) : (
                topRecent.map((item, index) => (
                  <div
                    key={item.user.id + "-recent"}
                    className="d-flex align-items-center p-3 mb-3"
                    style={{
                      borderRadius: "14px",
                      background: "#f3fcf7",
                      transition: "0.2s",
                    }}
                  >
                    {/* Avatar */}
                    <div style={{ marginRight: 14 }}>
                      <img
                        src={
                          item.avatar
                            ? item.avatar
                            : "https://ui-avatars.com/api/?name=" +
                            formatName(item.user)
                        }
                        alt="avatar"
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #ff9ecf, #ff6b9d)",
                          color: "white",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontWeight: "700",
                          marginRight: 14,
                          fontSize: "18px",
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-grow-1">
                      <div className="fw-semibold">
                        {index + 1} {formatName(item.user)}
                      </div>
                      <div className="text-muted small">
                        {item.user.username} · {item.user.phone}
                      </div>
                    </div>

                    {/* Time + View */}
                    <div className="text-end">
                      {/* <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleView(item.user.id)}
                      >
                        Xem
                      </button> */}

                      <div className="fw-semibold" style={{ color: "#2b8a3e" }}>
                        {new Date(item.lastHireTime).toLocaleTimeString(
                          "vi-VN",
                          { hour: "2-digit", minute: "2-digit" }
                        )}{" "}
                        {new Date(item.lastHireTime).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>

                      {/* <div className="text-muted small">
                        {new Date(item.lastHireTime).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div> */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <UserDetailModal
        profile={profile}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
