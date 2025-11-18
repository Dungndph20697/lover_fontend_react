import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
    verifyPassword,
    getRevenueToday,
    getRevenueByWeek,
    getRevenueRange,
    formatLocalDate,
    getRevenueByDay
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

                let data, items = [], total = 0;

                if (values.type === "today") {
                    data = await getRevenueToday();
                    total = Number(data.revenue);
                    items = [{ name: "Hôm nay", value: total }];
                    setChartData({ type: "today", items, total });

                } else if (values.type === "month") {
                    // Tháng này → xem theo tuần
                    const today = new Date();
                    const start = new Date(today.getFullYear(), today.getMonth(), 1);
                    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                    const startAt = formatLocalDate(start);
                    const endAt = formatLocalDate(end);
                    data = await getRevenueByDay(startAt, endAt);

                    items = (data.data || []).map(w => ({
                        name: w.date,
                        value: Number(w.revenue)
                    }));

                    const total = items.reduce((sum, i) => sum + i.value, 0);
                    setChartData({ type: "month", items, total });
                } else if (values.type === "range") {
                    // Khoảng ngày → xem theo tháng
                    data = await getRevenueByDay(values.start, values.end); // gọi /day-range
                    items = (data.data || []).map(d => ({
                        name: d.date,        // yyyy-MM-dd
                        value: Number(d.revenue)
                    }));
                    total = items.reduce((sum, i) => sum + i.value, 0);
                    setChartData({ type: "range", items, total })
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

                            <div style={{ width: "100%", height: 450 }}>
                                <ResponsiveContainer>
                                    {/* RANGE = LINE CHART */}
                                    {chartData.type === "range" ? (
                                        <BarChart data={chartData.items}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(v) => v.toLocaleString()} />
                                            <Legend />
                                            <Bar dataKey="value" fill="#0d6efd" label={{ position: "top" }} />
                                        </BarChart>
                                    ) : (
                                        // TODAY + MONTH use BarChart
                                        <BarChart data={chartData.items}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(v) => v.toLocaleString()} />
                                            <Legend />
                                            <Bar dataKey="value" fill="#0d6efd" label={{ position: "top" }} />
                                        </BarChart>
                                    )}
                                </ResponsiveContainer>
                            </div>

                            {/* TOTAL */}
                            <h5 className="text-center mt-3 text-primary">
                                Tổng: {chartData.total.toLocaleString()} VND
                            </h5>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}