import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
import {
    checkUsernameExists,
    checkEmailExists,
    checkPhoneExists,
    checkCccdExists,
    registerUser
} from "../../service/user/Register";
import Header from "../user/layout/Header.jsx";
import Footer from "../user/layout/Footer.jsx";

const Register = () => {
    const navigate = useNavigate();

    // Lưu trạng thái: true = khả dụng (chưa tồn tại), false = đã tồn tại, null = chưa check
    const checkResults = useRef({
        username: null,
        email: null,
        phone: null,
        cccd: null
    });

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

    const getValidationSchema = () => {
        return Yup.object({
            username: Yup.string()
                .min(3, "Tên đăng nhập phải từ 3-50 ký tự")
                .max(50, "Tên đăng nhập phải từ 3-50 ký tự")
                .required("Không được để trống")
                .test('username-exists', 'Tên đăng nhập đã tồn tại', async function (value) {
                    if (!value || value.length < 3) {
                        checkResults.current.username = null;
                        return true;
                    }

                    try {
                        const exists = await checkUsernameExists(value);
                        // exists = true nghĩa là ĐÃ TỒN TẠI
                        // Lưu !exists = true nghĩa là KHẢ DỤNG (chưa tồn tại)
                        checkResults.current.username = !exists;
                        return !exists; // Trả về true nếu chưa tồn tại (khả dụng)
                    } catch (error) {
                        checkResults.current.username = null;
                        return true;
                    }
                }),
            password: Yup.string()
                .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
                .required("Không được để trống"),
            email: Yup.string()
                .email("Email không hợp lệ")
                .required("Không được để trống")
                .test('email-exists', 'Email đã tồn tại', async function (value) {
                    if (!value || !value.includes('@')) {
                        checkResults.current.email = null;
                        return true;
                    }

                    try {
                        const exists = await checkEmailExists(value);
                        checkResults.current.email = !exists;
                        return !exists;
                    } catch (error) {
                        checkResults.current.email = null;
                        return true;
                    }
                }),
            phone: Yup.string()
                .matches(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ")
                .required("Không được để trống")
                .test('phone-exists', 'Số điện thoại đã tồn tại', async function (value) {
                    if (!value || value.length < 10) {
                        checkResults.current.phone = null;
                        return true;
                    }

                    try {
                        const exists = await checkPhoneExists(value);
                        checkResults.current.phone = !exists;
                        return !exists;
                    } catch (error) {
                        checkResults.current.phone = null;
                        return true;
                    }
                }),
            cccd: Yup.string()
                .matches(/^[0-9]{9,12}$/, "Số CCCD phải từ 9–12 số")
                .required("Không được để trống")
                .test('cccd-exists', 'Số CCCD đã tồn tại', async function (value) {
                    if (!value || value.length < 9) {
                        checkResults.current.cccd = null;
                        return true;
                    }

                    try {
                        const exists = await checkCccdExists(value);
                        checkResults.current.cccd = !exists;
                        return !exists;
                    } catch (error) {
                        checkResults.current.cccd = null;
                        return true;
                    }
                }),
            firstName: Yup.string().required("Không được để trống"),
            lastName: Yup.string().required("Không được để trống"),
            nickname: Yup.string(),
            roleId: Yup.number().oneOf([1, 2], "Chọn vai trò hợp lệ"),
        });
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
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
                checkResults.current = {
                    username: null,
                    email: null,
                    phone: null,
                    cccd: null
                };
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
                        validationSchema={getValidationSchema()}
                        onSubmit={handleSubmit}
                        validateOnChange={false}
                        validateOnBlur={true}
                    >
                        {({ values, errors, touched, isSubmitting, validateField }) => (
                            <Form>
                                {/* USERNAME */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-person-circle me-1 text-danger"></i>
                                        Tên đăng nhập <span className="text-danger">*</span>
                                    </label>
                                    <Field
                                        name="username"
                                        className="form-control"
                                        placeholder="Nhập tên đăng nhập"
                                        onBlur={() => validateField('username')}
                                    />
                                    <ErrorMessage
                                        name="username"
                                        component="div"
                                        className="text-danger small mt-1"
                                    />
                                    {!errors.username && touched.username && checkResults.current.username === true && (
                                        <div className="text-success small mt-1">
                                            ✅ Tên đăng nhập khả dụng
                                        </div>
                                    )}
                                </div>

                                {/* PASSWORD */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-lock-fill me-1 text-danger"></i>Mật khẩu <span className="text-danger">*</span>
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
                                        className="text-danger small mt-1"
                                    />
                                </div>

                                {/* EMAIL */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-envelope-fill me-1 text-danger"></i>
                                        Email <span className="text-danger">*</span>
                                    </label>
                                    <Field
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Nhập email"
                                        onBlur={() => validateField('email')}
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-danger small mt-1"
                                    />
                                    {!errors.email && touched.email && checkResults.current.email === true && (
                                        <div className="text-success small mt-1">
                                            ✅ Email khả dụng
                                        </div>
                                    )}
                                </div>

                                {/* PHONE */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-telephone-fill me-1 text-danger"></i>Số
                                        điện thoại <span className="text-danger">*</span>
                                    </label>
                                    <Field
                                        name="phone"
                                        className="form-control"
                                        placeholder="Nhập số điện thoại"
                                        onBlur={() => validateField('phone')}
                                    />
                                    <ErrorMessage
                                        name="phone"
                                        component="div"
                                        className="text-danger small mt-1"
                                    />
                                    {!errors.phone && touched.phone && checkResults.current.phone === true && (
                                        <div className="text-success small mt-1">
                                            ✅ Số điện thoại khả dụng
                                        </div>
                                    )}
                                </div>

                                {/* CCCD */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-card-text me-1 text-danger"></i>Số CCCD <span className="text-danger">*</span>
                                    </label>
                                    <Field
                                        name="cccd"
                                        className="form-control"
                                        placeholder="Nhập số CCCD"
                                        onBlur={() => validateField('cccd')}
                                    />
                                    <ErrorMessage
                                        name="cccd"
                                        component="div"
                                        className="text-danger small mt-1"
                                    />
                                    {!errors.cccd && touched.cccd && checkResults.current.cccd === true && (
                                        <div className="text-success small mt-1">
                                            ✅ Số CCCD khả dụng
                                        </div>
                                    )}
                                </div>

                                {/* FIRST NAME & LAST NAME */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-person-fill me-1 text-danger"></i>Họ <span className="text-danger">*</span>
                                        </label>
                                        <Field
                                            name="firstName"
                                            className="form-control"
                                            placeholder="Nhập họ"
                                        />
                                        <ErrorMessage
                                            name="firstName"
                                            component="div"
                                            className="text-danger small mt-1"
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-person-fill me-1 text-danger"></i>Tên <span className="text-danger">*</span>
                                        </label>
                                        <Field
                                            name="lastName"
                                            className="form-control"
                                            placeholder="Nhập tên"
                                        />
                                        <ErrorMessage
                                            name="lastName"
                                            component="div"
                                            className="text-danger small mt-1"
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
                                        trò <span className="text-danger">*</span>
                                    </label>
                                    <div className="d-flex gap-4">
                                        <label className="form-check-label">
                                            <Field
                                                type="radio"
                                                name="roleId"
                                                value={1}
                                                className="form-check-input me-2"
                                            />
                                            Người dùng
                                        </label>

                                        <label className="form-check-label">
                                            <Field
                                                type="radio"
                                                name="roleId"
                                                value={2}
                                                className="form-check-input me-2"
                                            />
                                            Cung cấp dịch vụ
                                        </label>
                                    </div>
                                    <ErrorMessage
                                        name="roleId"
                                        component="div"
                                        className="text-danger small mt-1"
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