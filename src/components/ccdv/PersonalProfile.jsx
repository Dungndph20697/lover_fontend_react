import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createCcdvProfile } from "../../service/ccdvProfileService/ccdvProfileService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CcdvProfileForm() {
    const [files, setFiles] = useState({
        avatar: null,
        portrait1: null,
        portrait2: null,
        portrait3: null,
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState("");

    // 🔹 Lấy userId từ localStorage
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            setUserId(user.id);
        }
    }, []);

    // 🔹 Formik setup
    const formik = useFormik({
        initialValues: {
            fullName: "",
            yearOfBirth: "",
            gender: "",
            city: "",
            nationality: "",
            height: "",
            weight: "",
            hobbies: "",
            description: "",
            requirement: "",
            facebookLink: "",
            createdAt: new Date().toISOString().split("T")[0],
            hireCount: 0,
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required("Họ và tên là bắt buộc"),
            yearOfBirth: Yup.number()
                .required("Năm sinh là bắt buộc")
                .min(1900, "Năm sinh không hợp lệ")
                .max(new Date().getFullYear(), "Năm sinh không hợp lệ"),
            gender: Yup.string().required("Giới tính là bắt buộc"),
            city: Yup.string().required("Thành phố là bắt buộc"),
            nationality: Yup.string().required("Quốc tịch là bắt buộc"),
            height: Yup.number().nullable(),
            weight: Yup.number().nullable(),
            facebookLink: Yup.string().url("Link Facebook không hợp lệ").nullable(),
        }),
        onSubmit: async (values) => {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("Vui lòng đăng nhập trước khi đăng thông tin!");
                return;
            }

            // 🔸 Kiểm tra file
            if (!files.avatar || !files.portrait1 || !files.portrait2 || !files.portrait3) {
                setMessage("Vui lòng chọn tất cả các ảnh yêu cầu!");
                return;
            }

            // 🔸 Tạo FormData
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => formData.append(key, value));
            Object.entries(files).forEach(([key, value]) => formData.append(key, value));
            formData.append("userId", userId);

            try {
                const data = await createCcdvProfile(formData, token);
                setMessage("✅ Đăng thông tin thành công!");
                console.log("Phản hồi:", data);
            } catch (err) {
                setMessage("❌ Lỗi khi gửi form: " + err.message);
            }
        },
    });

    // 🔹 Xử lý chọn ảnh
    const handleFileChange = (e) => {
        const { name, files: fileList } = e.target;
        const file = fileList[0];
        setFiles((prev) => ({ ...prev, [name]: file }));

        if (name === "avatar" && file) {
            const reader = new FileReader();
            reader.onload = (event) => setAvatarPreview(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{
                background: "linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%)",
                fontFamily: "'Poppins', sans-serif",
                padding: "40px 0",
            }}
        >
            <div
                className="card shadow-lg p-4"
                style={{
                    maxWidth: "800px",
                    width: "100%",
                    borderRadius: "20px",
                    backgroundColor: "white",
                }}
            >
                <h2 className="text-center mb-4 fw-bold" style={{ color: "#e75480" }}>
                    💕 Đăng Thông Tin Cá Nhân CCDV 💕
                </h2>

                {message && (
                    <div className="alert alert-info text-center" style={{ borderRadius: "10px" }}>
                        {message}
                    </div>
                )}

                <form onSubmit={formik.handleSubmit}>
                    {/* Họ tên + Năm sinh */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Họ và tên *</label>
                            <input
                                type="text"
                                name="fullName"
                                className={`form-control ${formik.touched.fullName && formik.errors.fullName ? "is-invalid" : ""}`}
                                {...formik.getFieldProps("fullName")}
                            />
                            {formik.touched.fullName && formik.errors.fullName && (
                                <div className="invalid-feedback">{formik.errors.fullName}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Năm sinh *</label>
                            <input
                                type="number"
                                name="yearOfBirth"
                                className={`form-control ${formik.touched.yearOfBirth && formik.errors.yearOfBirth ? "is-invalid" : ""}`}
                                {...formik.getFieldProps("yearOfBirth")}
                            />
                            {formik.touched.yearOfBirth && formik.errors.yearOfBirth && (
                                <div className="invalid-feedback">{formik.errors.yearOfBirth}</div>
                            )}
                        </div>
                    </div>

                    {/* Giới tính - Thành phố - Quốc tịch */}
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Giới tính *</label>
                            <input
                                type="text"
                                name="gender"
                                className={`form-control ${formik.touched.gender && formik.errors.gender ? "is-invalid" : ""}`}
                                {...formik.getFieldProps("gender")}
                            />
                            {formik.touched.gender && formik.errors.gender && (
                                <div className="invalid-feedback">{formik.errors.gender}</div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Thành phố *</label>
                            <input
                                type="text"
                                name="city"
                                className={`form-control ${formik.touched.city && formik.errors.city ? "is-invalid" : ""}`}
                                {...formik.getFieldProps("city")}
                            />
                            {formik.touched.city && formik.errors.city && (
                                <div className="invalid-feedback">{formik.errors.city}</div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Quốc tịch *</label>
                            <input
                                type="text"
                                name="nationality"
                                className={`form-control ${formik.touched.nationality && formik.errors.nationality ? "is-invalid" : ""}`}
                                {...formik.getFieldProps("nationality")}
                            />
                            {formik.touched.nationality && formik.errors.nationality && (
                                <div className="invalid-feedback">{formik.errors.nationality}</div>
                            )}
                        </div>
                    </div>

                    {/* Chiều cao - Cân nặng */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Chiều cao (cm)</label>
                            <input
                                type="number"
                                name="height"
                                className="form-control"
                                {...formik.getFieldProps("height")}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Cân nặng (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                className="form-control"
                                {...formik.getFieldProps("weight")}
                            />
                        </div>
                    </div>

                    {/* Sở thích, Mô tả, Yêu cầu */}
                    <div className="mb-3">
                        <label className="form-label">Sở thích</label>
                        <textarea name="hobbies" className="form-control" rows="2" {...formik.getFieldProps("hobbies")} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mô tả về bản thân</label>
                        <textarea name="description" className="form-control" rows="3" {...formik.getFieldProps("description")} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Yêu cầu với người thuê</label>
                        <textarea name="requirement" className="form-control" rows="3" {...formik.getFieldProps("requirement")} />
                    </div>

                    {/* Facebook */}
                    <div className="mb-3">
                        <label className="form-label">Facebook (link)</label>
                        <input
                            type="url"
                            name="facebookLink"
                            className={`form-control ${formik.touched.facebookLink && formik.errors.facebookLink ? "is-invalid" : ""}`}
                            {...formik.getFieldProps("facebookLink")}
                        />
                        {formik.touched.facebookLink && formik.errors.facebookLink && (
                            <div className="invalid-feedback">{formik.errors.facebookLink}</div>
                        )}
                    </div>

                    {/* Avatar + ảnh chân dung */}
                    <div className="mb-3 text-center">
                        <label className="form-label fw-semibold">Ảnh đại diện *</label>
                        <input type="file" name="avatar" className="form-control mb-3" onChange={handleFileChange} />
                        {avatarPreview && (
                            <img
                                src={avatarPreview}
                                alt="avatar preview"
                                className="rounded-circle shadow-sm"
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    objectFit: "cover",
                                    border: "3px solid #e75480",
                                }}
                            />
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Ảnh chân dung (3 ảnh) *</label>
                        <div className="d-flex gap-2 flex-wrap">
                            <input type="file" name="portrait1" className="form-control" onChange={handleFileChange} />
                            <input type="file" name="portrait2" className="form-control" onChange={handleFileChange} />
                            <input type="file" name="portrait3" className="form-control" onChange={handleFileChange} />
                        </div>
                    </div>

                    {/* Thông tin hệ thống */}
                    <div className="mb-3 text-muted small">
                        <p>📅 Ngày tham gia: <strong>{formik.values.createdAt}</strong></p>
                        <p>🧾 Số lần được thuê: <strong>{formik.values.hireCount}</strong> (tự động cập nhật)</p>
                    </div>

                    {/* Nút submit */}
                    <button
                        type="submit"
                        className="btn w-100 mt-3 fw-semibold"
                        style={{
                            background: "linear-gradient(45deg, #ff6b9f, #e75480)",
                            color: "white",
                            border: "none",
                            borderRadius: "50px",
                            padding: "12px",
                            fontSize: "1.1rem",
                            transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => (e.target.style.opacity = "0.85")}
                        onMouseOut={(e) => (e.target.style.opacity = "1")}
                    >
                        💌 Gửi thông tin
                    </button>
                </form>
            </div>
        </div>
    );
}