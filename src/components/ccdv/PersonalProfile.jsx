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
            style={{
                // minHeight: "100vh",
                background: "linear-gradient(135deg, #ffe6eb 0%, #ffb6c1 100%)",
                fontFamily: "'Poppins', sans-serif",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "60px 20px",
                boxSizing: "border-box",
            }}
        >
            <div
                className="shadow-lg p-5"
                style={{
                    width: "100%",
                    maxWidth: "900px",
                    borderRadius: "25px",
                    backgroundColor: "white",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                }}
            >
                <h2
                    className="text-center mb-4 fw-bold"
                    style={{
                        color: "#e75480",
                        fontSize: "1.8rem",
                        letterSpacing: "0.5px",
                    }}
                >
                    💖 Đăng Thông Tin Cá Nhân CCDV 💖
                </h2>

                {message && (
                    <div
                        className="alert alert-info text-center"
                        style={{
                            borderRadius: "12px",
                            background: "#fff5f8",
                            color: "#e75480",
                            border: "1px solid #ffc4d0",
                            fontWeight: "500",
                        }}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={formik.handleSubmit}>
                    {/* ======= Họ tên & Năm sinh ======= */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Họ và tên *</label>
                            <input
                                type="text"
                                name="fullName"
                                className="form-control"
                                style={{ borderRadius: "10px" }}
                                {...formik.getFieldProps("fullName")}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Năm sinh *</label>
                            <input
                                type="number"
                                name="yearOfBirth"
                                className="form-control"
                                style={{ borderRadius: "10px" }}
                                {...formik.getFieldProps("yearOfBirth")}
                            />
                        </div>
                    </div>

                    {/* ======= Giới tính, Thành phố, Quốc tịch ======= */}
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Giới tính *</label>
                            <input
                                type="text"
                                name="gender"
                                className="form-control"
                                style={{ borderRadius: "10px" }}
                                {...formik.getFieldProps("gender")}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Thành phố *</label>
                            <input
                                type="text"
                                name="city"
                                className="form-control"
                                style={{ borderRadius: "10px" }}
                                {...formik.getFieldProps("city")}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Quốc tịch *</label>
                            <input
                                type="text"
                                name="nationality"
                                className="form-control"
                                style={{ borderRadius: "10px" }}
                                {...formik.getFieldProps("nationality")}
                            />
                        </div>
                    </div>

                    {/* ======= Chiều cao & Cân nặng ======= */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Chiều cao (cm)</label>
                            <input
                                type="number"
                                name="height"
                                className="form-control"
                                style={{ borderRadius: "10px" }}
                                {...formik.getFieldProps("height")}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Cân nặng (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                className="form-control"
                                style={{ borderRadius: "10px" }}
                                {...formik.getFieldProps("weight")}
                            />
                        </div>
                    </div>

                    {/* ======= Textarea ======= */}
                    {["hobbies", "description", "requirement"].map((field, index) => (
                        <div className="mb-3" key={field}>
                            <label className="form-label fw-semibold">
                                {index === 0
                                    ? "Sở thích"
                                    : index === 1
                                        ? "Mô tả về bản thân"
                                        : "Yêu cầu với người thuê"}
                            </label>
                            <textarea
                                name={field}
                                className="form-control"
                                rows="3"
                                style={{ borderRadius: "10px" }}
                                {...formik.getFieldProps(field)}
                            />
                        </div>
                    ))}

                    {/* ======= Facebook ======= */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Facebook (link)</label>
                        <input
                            type="url"
                            name="facebookLink"
                            className="form-control"
                            style={{ borderRadius: "10px" }}
                            {...formik.getFieldProps("facebookLink")}
                        />
                    </div>

                    {/* ======= Ảnh đại diện ======= */}
                    <div className="mb-4 text-center">
                        <label className="form-label fw-semibold fs-5">Ảnh đại diện *</label>
                        <input
                            type="file"
                            name="avatar"
                            className="form-control mb-3"
                            onChange={handleFileChange}
                            style={{ borderRadius: "10px" }}
                        />
                        {avatarPreview && (
                            <div
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    margin: "0 auto",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: "3px solid #e75480",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                }}
                            >
                                <img
                                    src={avatarPreview}
                                    alt="avatar preview"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* ======= Ảnh chân dung ======= */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold fs-5">
                            Ảnh chân dung (3 ảnh) *
                        </label>
                        <div className="d-flex flex-column gap-2">
                            <input
                                type="file"
                                name="portrait1"
                                className="form-control"
                                style={{ borderRadius: "10px" }}
                                onChange={handleFileChange}
                            />
                            <input
                                type="file"
                                name="portrait2"
                                className="form-control"
                                style={{ borderRadius: "10px" }}
                                onChange={handleFileChange}
                            />
                            <input
                                type="file"
                                name="portrait3"
                                className="form-control"
                                style={{ borderRadius: "10px" }}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    {/* ======= Thông tin hệ thống ======= */}
                    <div className="text-muted small mb-4">
                        <p>📅 Ngày tham gia: <strong>{formik.values.createdAt}</strong></p>
                        <p>🧾 Số lần được thuê: <strong>{formik.values.hireCount}</strong></p>
                    </div>

                    {/* ======= Button ======= */}
                    <button
                        type="submit"
                        className="w-100 fw-semibold"
                        style={{
                            background: "linear-gradient(45deg, #ff6b9f, #e75480)",
                            color: "white",
                            border: "none",
                            borderRadius: "50px",
                            padding: "14px",
                            fontSize: "1.1rem",
                            transition: "0.3s",
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