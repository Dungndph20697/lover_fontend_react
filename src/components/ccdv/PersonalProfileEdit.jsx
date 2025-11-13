import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { getProfileByUserId, updateCcdvProfile } from "../../service/ccdvProfileService/ccdvProfileService";

export default function CcdvProfileEditForm({ setProfile }) {
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


    // ✅ Schema dùng khi tạo mới (bắt buộc có ảnh)
    const createSchema = Yup.object({
        fullName: Yup.string().required("Họ và tên là bắt buộc").min(3, "Tối thiểu 3 ký tự").max(50, "Tối đa 50 ký tự"),
        yearOfBirth: Yup.number()
            .required("Năm sinh là bắt buộc")
            .min(1900, "Năm sinh không hợp lệ")
            .max(new Date().getFullYear(), "Năm sinh không được lớn hơn hiện tại"),
        gender: Yup.string().required("Giới tính là bắt buộc"),
        city: Yup.string().required("Thành phố là bắt buộc"),
        nationality: Yup.string().required("Quốc tịch là bắt buộc"),
        height: Yup.number().nullable(),
        weight: Yup.number().nullable(),
        hobbies: Yup.string().nullable(),
        description: Yup.string().nullable(),
        requirement: Yup.string().nullable(),
        facebookLink: Yup.string().nullable().url("Link Facebook không hợp lệ"),

        // ✅ ảnh bắt buộc khi tạo mới
        avatar: Yup.mixed()
            .required("Ảnh đại diện là bắt buộc")
            .test("fileType", "Chỉ nhận ảnh PNG/JPG", value =>
                value && ["image/jpeg", "image/png"].includes(value.type)
            ),

        portrait1: Yup.mixed()
            .required("Ảnh chân dung 1 là bắt buộc")
            .test("fileType", "Chỉ nhận ảnh PNG/JPG", value =>
                value && ["image/jpeg", "image/png"].includes(value.type)
            ),

        portrait2: Yup.mixed()
            .required("Ảnh chân dung 2 là bắt buộc")
            .test("fileType", "Chỉ nhận ảnh PNG/JPG", value =>
                value && ["image/jpeg", "image/png"].includes(value.type)
            ),

        portrait3: Yup.mixed()
            .required("Ảnh chân dung 3 là bắt buộc")
            .test("fileType", "Chỉ nhận ảnh PNG/JPG", value =>
                value && ["image/jpeg", "image/png"].includes(value.type)
            ),
    });

    // ✅ Schema dùng khi chỉnh sửa (ảnh không bắt buộc)
    const editSchema = Yup.object({
        fullName: Yup.string().required("Họ và tên là bắt buộc").min(3, "Tối thiểu 3 ký tự").max(50, "Tối đa 50 ký tự"),
        yearOfBirth: Yup.number()
            .required("Năm sinh là bắt buộc")
            .min(1900, "Năm sinh không hợp lệ")
            .max(new Date().getFullYear(), "Năm sinh không được lớn hơn hiện tại"),
        gender: Yup.string().required("Giới tính là bắt buộc"),
        city: Yup.string().required("Thành phố là bắt buộc"),
        nationality: Yup.string().required("Quốc tịch là bắt buộc"),
        height: Yup.number().nullable(),
        weight: Yup.number().nullable(),
        hobbies: Yup.string().nullable(),
        description: Yup.string().nullable(),
        requirement: Yup.string().nullable(),
        facebookLink: Yup.string().nullable().url("Link Facebook không hợp lệ"),

        // ✅ ảnh không bắt buộc, chỉ check định dạng nếu có file mới
        avatar: Yup.mixed().nullable().test("fileType", "Chỉ nhận ảnh PNG/JPG", value =>
            !value || ["image/jpeg", "image/png"].includes(value.type)
        ),
        portrait1: Yup.mixed().nullable().test("fileType", "Chỉ nhận ảnh PNG/JPG", value =>
            !value || ["image/jpeg", "image/png"].includes(value.type)
        ),
        portrait2: Yup.mixed().nullable().test("fileType", "Chỉ nhận ảnh PNG/JPG", value =>
            !value || ["image/jpeg", "image/png"].includes(value.type)
        ),
        portrait3: Yup.mixed().nullable().test("fileType", "Chỉ nhận ảnh PNG/JPG", value =>
            !value || ["image/jpeg", "image/png"].includes(value.type)
        ),
    });

    console.log(existingProfile ? 'edit' : 'create')

    // Formik
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
            console.log("Formik values:", formik.values);
            console.log("Formik errors:", formik.errors);
            console.log("Files state:", files);
            const token = localStorage.getItem("token");
            if (!existingProfile || !token) {
                setMessage("Vui lòng đăng nhập hoặc profile không tồn tại");
                return;
            }

            const formData = new FormData();

            // --- Text fields ---
            const textFields = [
                "fullName", "yearOfBirth", "gender", "city", "nationality",
                "height", "weight", "hobbies", "description", "requirement", "facebookLink"
            ];

            textFields.forEach(key => {
                const newValue = values[key];
                const oldValue = existingProfile[key];

                // Chỉ append nếu khác với dữ liệu cũ và không rỗng
                if (newValue !== undefined && newValue !== oldValue && newValue !== "") {
                    if (["yearOfBirth", "height", "weight"].includes(key)) {
                        formData.append(key, Number(newValue));
                    } else {
                        formData.append(key, newValue);
                    }
                }
            });

            // --- File fields ---
            ["avatar", "portrait1", "portrait2", "portrait3"].forEach(f => {
                if (files[f]) formData.append(f, files[f]);
            });

            try {
                const updated = await updateCcdvProfile(existingProfile.id, formData, token);

                Toast.fire({ icon: "success", title: "Cập nhật thành công!" });
                setMessage("✅ Cập nhật thành công!");

                // Merge state với dữ liệu mới từ backend
                // setProfile({ ...existingProfile, ...updated });
                setExistingProfile({ ...existingProfile, ...updated });

                // Reset file state sau submit (tùy chọn)
                setFiles({ avatar: null, portrait1: null, portrait2: null, portrait3: null });

                await formik.validateForm(); // validate tất cả fields
                console.log("Validated errors:", formik.errors);
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

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ padding: "40px 0", background: "linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%)" }}>
            <div className="card shadow-lg p-4" style={{ maxWidth: "800px", width: "100%", borderRadius: "20px", backgroundColor: "white" }}>
                <h2 className="text-center mb-4 fw-bold" style={{ color: "#e75480" }}>✏️ Chỉnh sửa Hồ sơ CCDV ✏️</h2>
                {message && <div className="alert alert-info text-center">{message}</div>}

                <form onSubmit={formik.handleSubmit}>
                    {["fullName", "yearOfBirth", "gender", "city", "nationality", "height", "weight", "hobbies", "description", "requirement", "facebookLink"].map(f => (
                        <div key={f} className="mb-3">
                            <label className="form-label">{f}</label>
                            {["hobbies", "description", "requirement"].includes(f) ? (
                                <textarea className="form-control" rows={3} {...formik.getFieldProps(f)} />
                            ) : (
                                <input
                                    type={["yearOfBirth", "height", "weight"].includes(f) ? "number" : "text"}
                                    className="form-control"
                                    {...formik.getFieldProps(f)}
                                />
                            )}
                            {formik.touched[f] && formik.errors[f] && (
                                <div className="text-danger small mt-1">{formik.errors[f]}</div>
                            )}
                        </div>
                    ))}

                    {/* Avatar */}
                    <div className="mb-3 text-center">
                        <label className="form-label fw-semibold">Ảnh đại diện</label>
                        <input type="file" className="form-control mb-3" onChange={e => handleFileChange(e, "avatar")} />
                        {formik.touched.avatar && formik.errors.avatar && (
                            <div className="text-danger small mt-1">{formik.errors.avatar}</div>
                        )}
                        {avatarPreview && <img src={avatarPreview} alt="avatar" className="rounded-circle shadow-sm" style={{ width: "120px", height: "120px", objectFit: "cover", border: "3px solid #e75480" }} />}
                    </div>

                    {/* Portraits */}
                    {["portrait1", "portrait2", "portrait3"].map(p => (
                        <div key={p} className="mb-3 text-center">
                            <label className="form-label fw-semibold">{p.toUpperCase()}</label>
                            <input type="file" className="form-control mb-3" onChange={e => handleFileChange(e, p)} />
                            {formik.touched[p] && formik.errors[p] && (
                                <div className="text-danger small mt-1">{formik.errors[p]}</div>
                            )}
                            {portraitPreviews[p] && <img src={portraitPreviews[p]} alt={p} className="rounded shadow-sm" style={{ width: "120px", height: "120px", objectFit: "cover", border: "2px solid #e75480" }} />}
                        </div>
                    ))}

                    <button type="submit" className="btn w-100 mt-3 fw-semibold" style={{ background: "linear-gradient(45deg, #ff6b9f, #e75480)", color: "white", border: "none", borderRadius: "50px", padding: "12px", fontSize: "1.1rem" }}>
                        💾 Lưu thay đổidfghjkl
                    </button>
                </form>
            </div>
        </div>
    );
}