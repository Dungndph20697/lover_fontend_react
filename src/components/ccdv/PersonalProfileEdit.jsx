import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { getProfileByUserId, updateCcdvProfile } from "../../service/ccdvProfileService/ccdvProfileService";

export default function CcdvProfileEditForm() {
    const [existingProfile, setExistingProfile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [portraitPreviews, setPortraitPreviews] = useState({ portrait1: null, portrait2: null, portrait3: null });
    const [files, setFiles] = useState({ avatar: null, portrait1: null, portrait2: null, portrait3: null });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
    });

    // Load profile khi component mount
    useEffect(() => {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (!userData || !token) {
            setLoading(false);
            return;
        }

        const user = JSON.parse(userData);
        getProfileByUserId(user.id, token)
            .then(profile => {
                setExistingProfile(profile);
                setAvatarPreview(profile.avatar || null);
                setPortraitPreviews({
                    portrait1: profile.portrait1 || null,
                    portrait2: profile.portrait2 || null,
                    portrait3: profile.portrait3 || null,
                });
            })
            .catch(err => console.error("Lỗi lấy profile:", err))
            .finally(() => setLoading(false));
    }, []);

    // Schema create (ảnh bắt buộc)
    const createSchema = Yup.object({
        fullName: Yup.string().required("Họ và tên là bắt buộc").min(3, "Tối thiểu 3 ký tự").max(50, "Tối đa 50 ký tự"),
        yearOfBirth: Yup.number().required("Năm sinh là bắt buộc").min(1900, "Năm sinh không hợp lệ").max(new Date().getFullYear(), "Năm sinh không được lớn hơn hiện tại"),
        gender: Yup.string().required("Vui lòng chọn giới tính").oneOf(["Nam", "Nữ", "Khác"], "Giới tính không hợp lệ"),
        city: Yup.string().required("Thành phố là bắt buộc").min(2, "Tên thành phố quá ngắn").max(50, "Tên thành phố quá dài"),
        nationality: Yup.string().required("Quốc tịch là bắt buộc"),
        height: Yup.number().nullable(),
        weight: Yup.number().nullable(),
        hobbies: Yup.string().nullable(),
        description: Yup.string().nullable(),
        requirement: Yup.string().nullable(),
        facebookLink: Yup.string().nullable().url("Link Facebook không hợp lệ"),
        avatar: Yup.mixed().required("Ảnh đại diện là bắt buộc").test("fileType", "Chỉ nhận ảnh PNG/JPG", value => value && ["image/jpeg", "image/png"].includes(value.type)),
        portrait1: Yup.mixed().required("Ảnh chân dung 1 là bắt buộc").test("fileType", "Chỉ nhận ảnh PNG/JPG", value => value && ["image/jpeg", "image/png"].includes(value.type)),
        portrait2: Yup.mixed().required("Ảnh chân dung 2 là bắt buộc").test("fileType", "Chỉ nhận ảnh PNG/JPG", value => value && ["image/jpeg", "image/png"].includes(value.type)),
        portrait3: Yup.mixed().required("Ảnh chân dung 3 là bắt buộc").test("fileType", "Chỉ nhận ảnh PNG/JPG", value => value && ["image/jpeg", "image/png"].includes(value.type)),
    });

    // Schema edit (ảnh không bắt buộc)
    const editSchema = Yup.object({
        fullName: Yup.string().required("Họ và tên là bắt buộc").min(3, "Tối thiểu 3 ký tự").max(50, "Tối đa 50 ký tự"),
        yearOfBirth: Yup.number().required("Năm sinh là bắt buộc").min(1900, "Năm sinh không hợp lệ").max(new Date().getFullYear(), "Năm sinh không được lớn hơn hiện tại"),
        gender: Yup.string().required("Vui lòng chọn giới tính").oneOf(["Nam", "Nữ", "Khác"], "Giới tính không hợp lệ"),
        city: Yup.string().required("Thành phố là bắt buộc").min(2, "Tên thành phố quá ngắn").max(50, "Tên thành phố quá dài"),
        nationality: Yup.string().required("Quốc tịch là bắt buộc"),
        height: Yup.number().nullable(),
        weight: Yup.number().nullable(),
        hobbies: Yup.string().nullable(),
        description: Yup.string().nullable(),
        requirement: Yup.string().nullable(),
        facebookLink: Yup.string().nullable().url("Link Facebook không hợp lệ"),
        avatar: Yup.mixed().nullable().test("fileType", "Chỉ nhận ảnh PNG/JPG", value => !value || ["image/jpeg", "image/png"].includes(value.type)),
        portrait1: Yup.mixed().nullable().test("fileType", "Chỉ nhận ảnh PNG/JPG", value => !value || ["image/jpeg", "image/png"].includes(value.type)),
        portrait2: Yup.mixed().nullable().test("fileType", "Chỉ nhận ảnh PNG/JPG", value => !value || ["image/jpeg", "image/png"].includes(value.type)),
        portrait3: Yup.mixed().nullable().test("fileType", "Chỉ nhận ảnh PNG/JPG", value => !value || ["image/jpeg", "image/png"].includes(value.type)),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            fullName: existingProfile?.fullName || "",
            yearOfBirth: existingProfile?.yearOfBirth || "",
            gender: existingProfile?.gender || "",
            city: existingProfile?.city || "",
            nationality: existingProfile?.nationality || "",
            height: existingProfile?.height || "",
            weight: existingProfile?.weight || "",
            hobbies: existingProfile?.hobbies || "",
            description: existingProfile?.description || "",
            requirement: existingProfile?.requirement || "",
            facebookLink: existingProfile?.facebookLink || "",
            avatar: null,
            portrait1: null,
            portrait2: null,
            portrait3: null,
        },
        validationSchema: existingProfile ? editSchema : createSchema,
        onSubmit: async (values) => {
            const token = localStorage.getItem("token");
            if (!existingProfile || !token) {
                setMessage("Vui lòng đăng nhập hoặc profile không tồn tại");
                return;
            }

            const formData = new FormData();
            const textFields = ["fullName", "yearOfBirth", "gender", "city", "nationality","height","weight","hobbies","description","requirement","facebookLink"];
            textFields.forEach(key => {
                const newValue = values[key];
                const oldValue = existingProfile[key];
                if (newValue !== undefined && newValue !== oldValue && newValue !== "") {
                    if (["yearOfBirth","height","weight"].includes(key)) formData.append(key, Number(newValue));
                    else formData.append(key, newValue);
                }
            });
            ["avatar","portrait1","portrait2","portrait3"].forEach(f => { if (files[f]) formData.append(f, files[f]); });

            try {
                const updated = await updateCcdvProfile(existingProfile.id, formData, token);
                Toast.fire({ icon: "success", title: "Cập nhật thành công!" });
                setMessage("✅ Cập nhật thành công!");
                setExistingProfile({ ...existingProfile, ...updated });
                setFiles({ avatar: null, portrait1: null, portrait2: null, portrait3: null });
                await formik.validateForm();
                navigate("/ccdv");
            } catch (err) {
                console.error("PUT ERROR:", err);
                setMessage("❌ Lỗi khi cập nhật profile. Xem console để debug.");
            }
        }
    });

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        setFiles(prev => ({ ...prev, [field]: file }));
        formik.setFieldValue(field, file);

        if (file) {
            const reader = new FileReader();
            reader.onload = ev => {
                if (field === "avatar") setAvatarPreview(ev.target.result);
                else setPortraitPreviews(prev => ({ ...prev, [field]: ev.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const navigate = useNavigate();
    const handleGoToProfile = () => navigate("/ccdv");

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-4" style={{ background: "linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%)", fontFamily: "'Poppins', sans-serif" }}>
            <button onClick={handleGoToProfile} className="btn btn-light mb-4 shadow-sm" style={{ borderRadius: "50px" }}>🔙 Quay lại trang userInfo</button>
            <div className="card shadow-lg p-4" style={{ maxWidth: "900px", width: "100%", borderRadius: "25px", backgroundColor: "rgba(255,255,255,0.95)" }}>
                <h2 className="text-center mb-4 fw-bold" style={{ color: "#e75480", letterSpacing: "1px" }}>✏️ Chỉnh sửa Hồ sơ CCDV ✏️</h2>
                {message && <div className="alert alert-info text-center" style={{ borderRadius: "10px", fontWeight: "500" }}>{message}</div>}

                <form onSubmit={formik.handleSubmit}>
                    {["fullName","yearOfBirth"].map(f => (
                        <div key={f} className="mb-3">
                            <label className="form-label fw-semibold text-capitalize">{f.replace(/([A-Z])/g," $1")}</label>
                            <input type={f==="yearOfBirth"?"number":"text"} className="form-control shadow-sm" {...formik.getFieldProps(f)} style={{ borderRadius: "12px", padding: "10px" }} />
                            {formik.touched[f] && formik.errors[f] && <div className="text-danger small mt-1">{formik.errors[f]}</div>}
                        </div>
                    ))}

                    {/* ✅ Giới tính */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold d-block">Giới tính *</label>
                        {["Nam","Nữ","Khác"].map(g => (
                            <div className="form-check form-check-inline" key={g}>
                                <input className="form-check-input" type="radio" name="gender" value={g} checked={formik.values.gender===g} onChange={()=>formik.setFieldValue("gender", g)} />
                                <label className="form-check-label">{g}</label>
                            </div>
                        ))}
                        {formik.touched.gender && formik.errors.gender && <div className="text-danger mt-1">{formik.errors.gender}</div>}
                    </div>

                    {/* ✅ Thành phố */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Thành phố *</label>
                        <select name="city" className={`form-select ${formik.touched.city && formik.errors.city ? "is-invalid":""}`} {...formik.getFieldProps("city")}>
                            <option value="">Chọn thành phố</option>
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                            <option value="Đà Nẵng">Đà Nẵng</option>
                            <option value="Hải Phòng">Hải Phòng</option>
                            <option value="Cần Thơ">Cần Thơ</option>
                            <option value="Nha Trang">Nha Trang</option>
                            <option value="Huế">Huế</option>
                            <option value="Vũng Tàu">Vũng Tàu</option>
                            <option value="Quy Nhơn">Quy Nhơn</option>
                        </select>
                        {formik.touched.city && formik.errors.city && <div className="invalid-feedback">{formik.errors.city}</div>}
                    </div>

                    {["nationality","height","weight","hobbies","description","requirement","facebookLink"].map(f => (
                        <div key={f} className="mb-3">
                            <label className="form-label fw-semibold text-capitalize">{f.replace(/([A-Z])/g," $1")}</label>
                            {["hobbies","description","requirement"].includes(f)?
                                <textarea className="form-control shadow-sm" rows={f==="hobbies"?2:3} {...formik.getFieldProps(f)} style={{borderRadius:"12px",padding:"10px"}} />:
                                <input type={["height","weight"].includes(f)?"number":"text"} className="form-control shadow-sm" {...formik.getFieldProps(f)} style={{borderRadius:"12px",padding:"10px"}} />
                            }
                            {formik.touched[f] && formik.errors[f] && <div className="text-danger small mt-1">{formik.errors[f]}</div>}
                        </div>
                    ))}

                    {/* Avatar */}
                    <div className="mb-4 text-center">
                        <label className="form-label fw-semibold">Ảnh đại diện</label>
                        <input type="file" className="form-control mb-2" onChange={e=>handleFileChange(e,"avatar")} style={{ borderRadius:"12px" }} />
                        {formik.touched.avatar && formik.errors.avatar && <div className="text-danger small mt-1">{formik.errors.avatar}</div>}
                        {avatarPreview && <img src={avatarPreview} alt="avatar" className="rounded-circle shadow-sm mt-2" style={{width:"130px",height:"130px",objectFit:"cover",border:"3px solid #e75480"}} />}
                    </div>

                    {/* Portraits */}
                    <div className="mb-4 text-center">
                        <label className="form-label fw-semibold mb-2">Ảnh chân dung (3 ảnh)</label>
                        <div className="d-flex gap-3 justify-content-center flex-wrap">
                            {["portrait1","portrait2","portrait3"].map(p=>(
                                <div key={p} className="text-center">
                                    <input type="file" className="form-control mb-2" onChange={e=>handleFileChange(e,p)} style={{borderRadius:"12px"}} />
                                    {formik.touched[p] && formik.errors[p] && <div className="text-danger small mt-1">{formik.errors[p]}</div>}
                                    {portraitPreviews[p] && <img src={portraitPreviews[p]} alt={p} className="rounded shadow-sm mt-1" style={{width:"120px",height:"120px",objectFit:"cover",border:"2px solid #e75480"}} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn w-100 fw-semibold shadow-sm" style={{background:"linear-gradient(45deg,#ff6b9f,#e75480)",color:"white",border:"none",borderRadius:"50px",padding:"14px",fontSize:"1.15rem",transition:"all 0.3s ease"}} onMouseOver={e=>e.target.style.opacity="0.85"} onMouseOut={e=>e.target.style.opacity="1"}>💾 Lưu thay đổi</button>
                </form>
            </div>
        </div>
    );
}