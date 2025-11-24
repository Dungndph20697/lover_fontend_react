import React from "react";

export default function CcdvDetailModal({ show, onClose, data }) {
  if (!show || !data) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content shadow-lg border-0 rounded-4">
            {/* HEADER */}
            <div className="modal-header bg-primary text-white rounded-top-4">
              <h5 className="modal-title fw-bold">Chi tiết CCDV</h5>
              <button
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            {/* BODY SCROLL */}
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <div className="row g-4">
                {/* AVATAR */}
                <div className="col-md-4 text-center">
                  <img
                    src={data.avatar}
                    alt="Avatar"
                    className="rounded-4 shadow-sm"
                    style={{
                      width: "100%",
                      height: "260px",
                      objectFit: "cover",
                      background: "#f0f0f0",
                    }}
                  />
                  <h5 className="mt-3 fw-semibold">{data.fullName}</h5>
                </div>

                {/* THÔNG TIN */}
                <div className="col-md-8">
                  <h6 className="fw-bold text-primary">Thông tin cá nhân</h6>
                  <table className="table table-bordered small">
                    <tbody>
                      <tr>
                        <th>Họ tên</th>
                        <td>{data.fullName}</td>
                      </tr>
                      <tr>
                        <th>Nickname</th>
                        <td>{data.nickname}</td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{data.email}</td>
                      </tr>
                      <tr>
                        <th>SĐT</th>
                        <td>{data.phone}</td>
                      </tr>
                      <tr>
                        <th>CCCD</th>
                        <td>{data.cccd}</td>
                      </tr>
                      <tr>
                        <th>Năm sinh</th>
                        <td>{data.yearOfBirth}</td>
                      </tr>
                      <tr>
                        <th>Thành phố</th>
                        <td>{data.city}</td>
                      </tr>
                    </tbody>
                  </table>

                  <h6 className="fw-bold text-primary mt-3">Thông tin khác</h6>
                  <table className="table table-bordered small">
                    <tbody>
                      <tr>
                        <th>Chiều cao</th>
                        <td>{data.height} cm</td>
                      </tr>
                      <tr>
                        <th>Cân nặng</th>
                        <td>{data.weight} kg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ẢNH CHÂN DUNG */}
              <h6 className="fw-bold text-primary mt-4">Ảnh chân dung</h6>
              <div className="d-flex gap-3 flex-wrap">
                {[data.portrait1, data.portrait2, data.portrait3]
                  .filter(Boolean)
                  .map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="portrait"
                      className="rounded-4 shadow-sm"
                      style={{
                        width: "180px",
                        height: "240px",
                        objectFit: "cover",
                        background: "#f0f0f0",
                      }}
                    />
                  ))}
              </div>

              {/* MÔ TẢ */}
              <h6 className="fw-bold text-primary mt-4">Mô tả</h6>
              <div className="p-3 border rounded-3 bg-light small">
                {data.description || "Không có mô tả"}
              </div>

              {/* YÊU CẦU */}
              <h6 className="fw-bold text-primary mt-3">Yêu cầu</h6>
              <div className="p-3 border rounded-3 bg-light small">
                {data.requirement || "Không có yêu cầu"}
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer border-0">
              <button
                className="btn btn-secondary rounded-3 px-4"
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ cursor: "pointer" }}
      ></div>
    </>
  );
}
