import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
import { checkUsernameExists, registerUser } from "../../service/user/Register";
import Header from "../user/layout/Header.jsx";
import Footer from "../user/layout/Footer.jsx";

const Register = () => {
  const navigate = useNavigate();
  const [usernameExists, setUsernameExists] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const initialValues = {
    username: "",
    password: "",
    email: "",
    phone: "",
    cccd: "",
    firstName: "",
    lastName: "",
    nickname: "",
    roleId: 1,
  };

  const validationSchema = Yup.object({
    username: Yup.string().min(3).max(50).required("Không được để trống"),
    password: Yup.string().min(6).required("Không được để trống"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Không được để trống"),
    phone: Yup.string()
      .matches(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ")
      .required("Không được để trống"),
    cccd: Yup.string()
      .matches(/^[0-9]{9,12}$/, "Số CCCD phải từ 9–12 số")
      .required("Không được để trống"),
    firstName: Yup.string().required("Không được để trống"),
    lastName: Yup.string().required("Không được để trống"),
    nickname: Yup.string(),
    roleId: Yup.number().oneOf([1, 2], "Chọn vai trò hợp lệ"),
  });

  const handleCheckUsername = (username) => {
    if (!username || username.trim().length < 3) {
      setUsernameExists(null);
      return;
    }
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      try {
        setCheckingUsername(true);
        const exists = await checkUsernameExists(username);
        setUsernameExists(exists);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    setTypingTimeout(timeout);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (usernameExists) {
      Swal.fire({
        icon: "error",
        title: "Tên đăng nhập đã tồn tại!",
        showConfirmButton: true,
      });
      setSubmitting(false);
      return;
    }

    try {
      const response = await registerUser(values);

      if (response.success === false) {
        Swal.fire({
          icon: "error",
          title: "Đăng ký thất bại!",
          text: response.message,
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "🎉 Đăng ký thành công!",
          text: "Đang chuyển đến trang đăng nhập...",
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => navigate("/login"), 1500);
        resetForm();
        setUsernameExists(null);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Đã xảy ra lỗi!",
        text: error.response?.data?.message || "Đăng ký không thành công.",
        showConfirmButton: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      
      <div
        className="d-flex justify-content-center align-items-center py-5"
        style={{
          background:
            "linear-gradient(to right, #ff9a9e 0%, #ffd1dc 45%, #ffe3e3 100%)",
          minHeight: "100vh",
        }}
      >
        <div
          className="card shadow-lg p-4 border-0"
          style={{
            width: "600px",
            borderRadius: "20px",
            backgroundColor: "rgba(255,255,255,0.95)",
          }}
        >
          <h2 className="text-center mb-4 fw-bold text-danger">
            <i className="bi bi-heart-fill me-2 text-danger"></i>Đăng ký tài
            khoản
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, isSubmitting }) => (
              <Form>
                {/* USERNAME */}
                <div className="mb-3 position-relative">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-person-circle me-1 text-danger"></i>
                    Tên đăng nhập
                  </label>
                  <Field
                    name="username"
                    className="form-control"
                    placeholder="Nhập tên đăng nhập"
                    onChange={(e) => {
                      handleChange(e);
                      handleCheckUsername(e.target.value);
                    }}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-danger small"
                  />
                  {checkingUsername && (
                    <div className="text-secondary small">
                      🔎 Đang kiểm tra...
                    </div>
                  )}
                  {!checkingUsername && usernameExists === true && (
                    <div className="text-danger small">
                      ❌ Tên đăng nhập đã tồn tại
                    </div>
                  )}
                  {!checkingUsername &&
                    usernameExists === false &&
                    values.username && (
                      <div className="text-success small">
                        ✅ Tên đăng nhập khả dụng
                      </div>
                    )}
                </div>

                {/* PASSWORD */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-lock-fill me-1 text-danger"></i>Mật khẩu
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Nhập mật khẩu"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* EMAIL */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-envelope-fill me-1 text-danger"></i>
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Nhập email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* PHONE */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-telephone-fill me-1 text-danger"></i>Số
                    điện thoại
                  </label>
                  <Field
                    name="phone"
                    className="form-control"
                    placeholder="Nhập số điện thoại"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* CCCD */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-card-text me-1 text-danger"></i>Số CCCD
                  </label>
                  <Field
                    name="cccd"
                    className="form-control"
                    placeholder="Nhập số CCCD"
                  />
                  <ErrorMessage
                    name="cccd"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* FIRST NAME */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-person-fill me-1 text-danger"></i>Họ
                    </label>
                    <Field
                      name="firstName"
                      className="form-control"
                      placeholder="Nhập họ"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  {/* LAST NAME */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-person-fill me-1 text-danger"></i>Tên
                    </label>
                    <Field
                      name="lastName"
                      className="form-control"
                      placeholder="Nhập tên"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                </div>

                {/* NICKNAME */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-pencil-square me-1 text-danger"></i>
                    Biệt danh (không bắt buộc)
                  </label>
                  <Field
                    name="nickname"
                    className="form-control"
                    placeholder="Nhập biệt danh"
                  />
                </div>

                {/* ROLE */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-people-fill me-1 text-danger"></i>Vai
                    trò
                  </label>
                  <div className="d-flex gap-4">
                    <label className="form-check-label">
                      <Field
                        type="radio"
                        name="roleId"
                        value="1"
                        className="form-check-input me-2"
                      />
                      Người dùng
                    </label>

                    <label className="form-check-label">
                      <Field
                        type="radio"
                        name="roleId"
                        value="2"
                        className="form-check-input me-2"
                      />
                      Cung cấp dịch vụ
                    </label>
                  </div>
                  <ErrorMessage
                    name="roleId"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="btn btn-danger w-100 fw-semibold rounded-pill mt-3 py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "⏳ Đang xử lý..." : "❤️ Đăng ký ngay"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;
