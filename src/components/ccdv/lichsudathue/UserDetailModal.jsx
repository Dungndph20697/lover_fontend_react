import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserDetailModal({ profile, show, onClose }) {
  if (!show) return null; // ❗ chỉ check show, KHÔNG check profile nữa

  // Data an toàn khi profile null
  const safe = (value, fallback = "Không có") =>
    value === null || value === undefined || value === "" ? fallback : value;

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.55)",
        zIndex: 1050,
        overflowY: "auto",
      }}
    >
      <div className="modal-dialog modal-lg mt-5">
        <div className="modal-content" style={{ borderRadius: "14px" }}>
          {/* HEADER */}
          <div
            className="modal-header"
            style={{
              background: "#ff6b9d",
              color: "white",
              borderTopLeftRadius: "14px",
              borderTopRightRadius: "14px",
            }}
          >
            <h5 className="modal-title">Thông tin khách thuê</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          {/* BODY */}
          <div className="modal-body">
            <div className="d-flex mb-3">
              <img
                src={safe(profile?.avatar, "https://via.placeholder.com/110")}
                alt="Avatar"
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #ffd6e7",
                }}
              />

              <div className="ms-3">
                <h4 className="fw-bold">
                  {profile?.user?.nickname &&
                  profile.user.nickname.trim() !== ""
                    ? profile.user.nickname
                    : `${profile?.user?.firstName || ""} ${
                        profile?.user?.lastName || ""
                      }`}
                </h4>
                <p className="text-muted m-0">
                  Năm sinh: {safe(profile?.yearOfBirth)}
                </p>
                <p className="text-muted m-0">
                  Giới tính: {safe(profile?.gender)}
                </p>
                <p className="text-muted m-0">
                  Thành phố: {safe(profile?.city)}
                </p>
                <p className="text-muted m-0">
                  Quốc tịch: {safe(profile?.nationality)}
                </p>
                <p className="text-muted m-0">
                  Cao: {safe(profile?.height)} cm — Nặng:{" "}
                  {safe(profile?.weight)} kg
                </p>
              </div>
            </div>

            <hr />

            <p>
              <strong>Sở thích:</strong> {safe(profile?.hobbies)}
            </p>
            <p>
              <strong>Mô tả:</strong> {safe(profile?.description)}
            </p>
            <p>
              <strong>Yêu cầu:</strong> {safe(profile?.requirement)}
            </p>

            {/* <hr /> */}

            {/* Portrait Images */}
            {/* <div className="row">
              {[profile?.portrait1, profile?.portrait2, profile?.portrait3].map(
                (img, i) =>
                  img ? (
                    <div className="col-md-4 mb-3" key={i}>
                      <img
                        src={img}
                        className="img-fluid rounded"
                        style={{
                          height: 200,
                          objectFit: "cover",
                          width: "100%",
                        }}
                        alt="portrait"
                      />
                    </div>
                  ) : (
                    <div
                      className="col-md-4 mb-3 text-center text-muted"
                      key={i}
                    >
                      <div
                        style={{
                          height: 200,
                          width: "100%",
                          background: "#f8f9fa",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontStyle: "italic",
                          color: "#aaa",
                        }}
                      >
                        Không có ảnh
                      </div>
                    </div>
                  )
              )}
            </div> */}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
