import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
    verifyPassword,
    getRevenueToday,
    getRevenueMonth,
    getRevenueRange,
} from "../../service/tong_doanh_thu_ccdv/revenueService";

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function RevenueForm() {
    const [chartData, setChartData] = useState(null);

    const formik = useFormik({
        initialValues: {
            password: "",
            start: "",
            end: "",
            type: "today",
        },
        validationSchema: Yup.object({
            password: Yup.string().required("Vui lòng nhập mật khẩu"),
            start: Yup.string().when("type", {
                is: "range",
                then: (schema) => schema.required("Ngày bắt đầu là bắt buộc"),
                otherwise: (schema) => schema.notRequired(),
            }),
            end: Yup.string().when("type", {
                is: "range",
                then: (schema) => schema.required("Ngày kết thúc là bắt buộc"),
                otherwise: (schema) => schema.notRequired(),
            }),
        }),
        onSubmit: async (values) => {
            try {
                const valid = await verifyPassword(values.password);
                if (!valid) {
                    Swal.fire("Lỗi", "Mật khẩu không đúng", "error");
                    return;
                }

                let data;
                if (values.type === "today") {
                    data = await getRevenueToday();
                    setChartData([{ name: "Hôm nay", value: Number(data.revenue) }]);
                } else if (values.type === "month") {
                    data = await getRevenueMonth();
                    setChartData([{ name: "Tháng này", value: Number(data.revenue) }]);
                } else if (values.type === "range") {
                    data = await getRevenueRange(values.start, values.end);
                    setChartData([{ name: `${values.start} → ${values.end}`, value: Number(data.revenue) }]);
                }
            } catch (err) {
                console.error(err);
                Swal.fire("Lỗi", "Không thể lấy dữ liệu doanh thu", "error");
            }
        },
    });

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h3 className="card-title mb-4 text-center">Xem doanh thu</h3>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                className={`form-control ${formik.errors.password ? 'is-invalid' : ''}`}
                            />
                            {formik.errors.password && (
                                <div className="invalid-feedback">{formik.errors.password}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Loại xem</label>
                            <select
                                name="type"
                                onChange={formik.handleChange}
                                value={formik.values.type}
                                className="form-select"
                            >
                                <option value="today">Hôm nay</option>
                                <option value="month">Tháng này</option>
                                <option value="range">Khoảng ngày</option>
                            </select>
                        </div>

                        {formik.values.type === "range" && (
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        name="start"
                                        onChange={formik.handleChange}
                                        value={formik.values.start}
                                        className={`form-control ${formik.errors.start ? 'is-invalid' : ''}`}
                                    />
                                    {formik.errors.start && (
                                        <div className="invalid-feedback">{formik.errors.start}</div>
                                    )}
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        name="end"
                                        onChange={formik.handleChange}
                                        value={formik.values.end}
                                        className={`form-control ${formik.errors.end ? 'is-invalid' : ''}`}
                                    />
                                    {formik.errors.end && (
                                        <div className="invalid-feedback">{formik.errors.end}</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary w-100">Xem doanh thu</button>
                    </form>

                    {chartData && (
                        <div className="mt-5">
                            <h5 className="text-center mb-3">Biểu đồ doanh thu</h5>
                            <div style={{ width: "100%", height: "500px" }}>
                                <ResponsiveContainer>
                                    {chartData.length === 1 ? (
                                        <BarChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#0d6efd" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => value.toLocaleString()} />
                                            <Legend />
                                            <Bar dataKey="value" fill="url(#colorRevenue)" label={{ position: 'top' }} />
                                        </BarChart>
                                    ) : (
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => value.toLocaleString()} />
                                            <Legend />
                                            <Line type="monotone" dataKey="value" stroke="#0d6efd" dot={{ r: 4 }} />
                                        </LineChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}