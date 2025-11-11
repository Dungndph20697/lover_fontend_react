import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { checkUsernameExists, registerUser } from "../../service/user/Register";

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
        email: Yup.string().email("Email không hợp lệ").required("Không được để trống"),
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

    // Kiểm tra username
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

    // Submit form
    const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
        if (usernameExists) {
            setStatus({ success: false, message: "Tên đăng nhập đã tồn tại!" });
            setSubmitting(false);
            return;
        }

        try {
            const response = await registerUser(values);

            if (response.success === false) {
                setStatus({ success: false, message: response.message });
            } else {
                setStatus({
                    success: true,
                    message: "🎉 Đăng ký thành công! Đang chuyển đến trang đăng nhập...",
                });
                setTimeout(() => navigate("/login"), 2500);
                resetForm();
                setUsernameExists(null);
            }
        } catch (error) {
            setStatus({
                success: false,
                message: error.response?.data?.message || "Đã xảy ra lỗi khi đăng ký.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "650px" }}>
            <h2 className="text-center mb-4">
                <i className="bi bi-person-plus-fill me-2"></i>Đăng ký tài khoản
            </h2>

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, handleChange, isSubmitting, status }) => (
                    <Form className="border rounded-3 p-4 shadow-sm bg-light">
                        {/* Username */}
                        <div className="mb-3 position-relative">
                            <label className="form-label">
                                <i className="bi bi-person-circle me-1"></i>Tên đăng nhập
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
                            <ErrorMessage name="username" component="div" className="text-danger small" />
                            {checkingUsername && <div className="text-secondary small">🔎 Đang kiểm tra...</div>}
                            {!checkingUsername && usernameExists === true && <div className="text-danger small">❌ Tên đăng nhập đã tồn tại</div>}
                            {!checkingUsername && usernameExists === false && values.username && <div className="text-success small">✅ Tên đăng nhập khả dụng</div>}
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-lock-fill me-1"></i>Mật khẩu</label>
                            <Field type="password" name="password" className="form-control" placeholder="Nhập mật khẩu" />
                            <ErrorMessage name="password" component="div" className="text-danger small" />
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-envelope-fill me-1"></i>Email</label>
                            <Field type="email" name="email" className="form-control" placeholder="Nhập email" />
                            <ErrorMessage name="email" component="div" className="text-danger small" />
                        </div>

                        {/* Phone */}
                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-telephone-fill me-1"></i>Số điện thoại</label>
                            <Field name="phone" className="form-control" placeholder="Nhập số điện thoại" />
                            <ErrorMessage name="phone" component="div" className="text-danger small" />
                        </div>

                        {/* CCCD */}
                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-card-text me-1"></i>Số CCCD</label>
                            <Field name="cccd" className="form-control" placeholder="Nhập số CCCD" />
                            <ErrorMessage name="cccd" component="div" className="text-danger small" />
                        </div>

                        {/* Họ */}
                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-person-lines-fill me-1"></i>Họ</label>
                            <Field name="firstName" className="form-control" placeholder="Nhập họ" />
                            <ErrorMessage name="firstName" component="div" className="text-danger small" />
                        </div>

                        {/* Tên */}
                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-person-lines-fill me-1"></i>Tên</label>
                            <Field name="lastName" className="form-control" placeholder="Nhập tên" />
                            <ErrorMessage name="lastName" component="div" className="text-danger small" />
                        </div>

                        {/* Nickname */}
                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-pencil-square me-1"></i>Biệt danh (không bắt buộc)</label>
                            <Field name="nickname" className="form-control" placeholder="Nhập biệt danh" />
                        </div>

                        {/* Role */}
                        <div className="mb-3">
                            <label className="form-label"><i className="bi bi-people-fill me-1"></i>Vai trò</label>
                            <div className="form-check">
                                <Field type="radio" name="roleId" value="1" id="roleUser" className="form-check-input" />
                                <label htmlFor="roleUser" className="form-check-label">🧍 Người dùng</label>
                            </div>
                            <div className="form-check">
                                <Field type="radio" name="roleId" value="2" id="roleCCDV" className="form-check-input" />
                                <label htmlFor="roleCCDV" className="form-check-label">💼 Cung cấp dịch vụ</label>
                            </div>
                            <ErrorMessage name="roleId" component="div" className="text-danger small" />
                        </div>

                        {/* Submit */}
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                <i className="bi bi-person-check-fill me-1"></i>
                                {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
                            </button>
                        </div>

                        {/* Thông báo */}
                        {status && (
                            <div className={`alert mt-3 ${status.success ? "alert-success" : "alert-danger"}`}>
                                {status.message}
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Register;
