import React from "react";
import Header from "../user/layout/Header.jsx";
import Footer from "./layout/Footer";
export default function Explore() {
  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1 className="text-center text-danger mb-4">Khám phá ❤️ Lover</h1>

        {/* Section 1: Giới thiệu */}
        <section className="mb-5">
          <div className="row align-items-center">
            <div className="col-md-3">
              <img
                src="data:image/jpeg;base64,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"
                alt="Khám phá"
                className="img-fluid rounded shadow-sm"
              />
            </div>
            <div className="col-md-9">
              <h2>Chào mừng đến với ❤️ Lover</h2>
              <p>
                ❤️ Lover là nền tảng kết nối bạn với những người thuê dịch vụ
                bạn cần, hoặc bạn cũng có thể đăng thông tin của mình để người
                khác thuê. Chúng tôi giúp bạn dễ dàng tìm kiếm, giao tiếp và
                trải nghiệm dịch vụ an toàn.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Tính năng */}
        <section className="mb-5">
          <h2 className="text-center text-danger mb-4">Tính năng nổi bật</h2>
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="p-4 border rounded shadow-sm h-100">
                <h4>Đăng ký & Đăng nhập</h4>
                <p>
                  Dễ dàng tạo tài khoản, quản lý thông tin cá nhân và dịch vụ
                  của bạn.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4 border rounded shadow-sm h-100">
                <h4>Khám phá dịch vụ</h4>
                <p>
                  Duyệt các dịch vụ và người dùng khác, tìm kiếm nhanh chóng
                  theo nhu cầu.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="p-4 border rounded shadow-sm h-100">
                <h4>Bảo mật & An toàn</h4>
                <p>
                  Chúng tôi cam kết bảo vệ thông tin cá nhân và giao dịch của
                  bạn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Cách thức hoạt động */}
        <section className="mb-5">
          <h2 className="text-center text-danger mb-4">Cách thức hoạt động</h2>
          <div className="row">
            <div className="col-md-4 text-center mb-3">
              <div className="p-3 border rounded shadow-sm">
                <h5>Bước 1</h5>
                <p>Đăng ký tài khoản và đăng nhập vào hệ thống.</p>
              </div>
            </div>
            <div className="col-md-4 text-center mb-3">
              <div className="p-3 border rounded shadow-sm">
                <h5>Bước 2</h5>
                <p>Khám phá dịch vụ, người thuê hoặc đăng thông tin của bạn.</p>
              </div>
            </div>
            <div className="col-md-4 text-center mb-3">
              <div className="p-3 border rounded shadow-sm">
                <h5>Bước 3</h5>
                <p>
                  Liên hệ, trao đổi và sử dụng dịch vụ an toàn, nhanh chóng.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Kêu gọi hành động */}
        <section className="text-center mb-5">
          <h2 className="text-danger mb-3">Bắt đầu ngay hôm nay!</h2>
          <p>
            Tham gia ❤️ Lover và trải nghiệm dịch vụ dễ dàng, nhanh chóng, an
            toàn.
          </p>
          <a href="/register" className="btn btn-danger btn-lg mt-3">
            Đăng ký ngay
          </a>
        </section>
      </div>
      <Footer />
    </>
  );
}
