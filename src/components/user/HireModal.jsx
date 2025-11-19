import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HireModal({ show, onClose, ccdvId }) {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load dịch vụ CCDV
  useEffect(() => {
    if (ccdvId) {
      axios
        .get(`http://localhost:8080/api/users/service/${ccdvId}`)
        .then((res) => setServices(res.data))
        .catch((err) => console.error(err));
    }
  }, [ccdvId]);

  // Schema validate bằng Yup
  const validationSchema = Yup.object({
    startTime: Yup.string()
      .required("Vui lòng chọn thời gian bắt đầu")
      .test("not-in-past", "Thời gian không được ở quá khứ", (value) => {
        if (!value) return false;

        const now = new Date();
        now.setSeconds(0, 0); // xoá giây và mili giây để không bị lệch

        const userTime = new Date(value);

        return userTime >= now;
      }),
    endTime: Yup.string()
      .required("Vui lòng chọn thời gian kết thúc")
      .test(
        "greater-than-start",
        "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
        function (value) {
          const { startTime } = this.parent;
          return new Date(value) > new Date(startTime);
        }
      ),
    address: Yup.string()
      .required("Địa chỉ gặp là bắt buộc")
      .min(3, "Địa chỉ quá ngắn"),
  });

  // Tính tổng tiền mỗi khi selectedServices hoặc thời gian thay đổi
  const calculateTotal = (startTime, endTime) => {
    if (!startTime || !endTime) return;

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (end <= start) return;

    const diffHours = (end - start) / (1000 * 60 * 60);
    let total = 0;

    selectedServices.forEach((id) => {
      const service = services.find((s) => s.id === id);
      if (service && service.totalPrice > 0) {
        total += service.totalPrice * diffHours;
      }
    });

    setTotalPrice(total);
  };

  const toggleService = (id, startTime, endTime) => {
    setSelectedServices((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id];
      calculateTotal(startTime, endTime);
      return updated;
    });
  };

  // Format tiền không có đuôi thập phân
  const formatMoney = (num) =>
    Math.round(num).toLocaleString("vi-VN").replace(/,/g, ".");

  if (!show) return null;

  return (
    <>
      <div className="custom-backdrop"></div>
      <div className="modal show fade d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <Formik
              initialValues={{
                startTime: "",
                endTime: "",
                address: "",
                message: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                if (selectedServices.length < 1) {
                  Swal.fire(
                    "Thiếu thông tin",
                    "Vui lòng chọn dịch vụ",
                    "warning"
                  );
                  return;
                }

                const data = {
                  ccdvId: ccdvId,
                  serviceDetailIds: selectedServices,
                  startTime: values.startTime + ":00",
                  endTime: values.endTime + ":00",
                  address: values.address,
                  message: values.message,
                };

                axios
                  .post("http://localhost:8080/api/hire/create", data, {
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  })
                  .then((res) => {
                    Swal.fire({
                      icon: "success",
                      title: "Thuê thành công!",
                      html: `
                      <div style="font-size: 16px; margin-top: 10px;">
                          <b>Dịch vụ đã được xác nhận.</b><br/>
                          Tổng tiền thanh toán: 
                          <span style="color: red; font-weight: bold;">
                              ${formatMoney(totalPrice)} ₫
                          </span>
                      </div>
                  `,
                      confirmButtonText: "OK",
                    });
                    onClose();
                  })
                  .catch((err) => {
                    Swal.fire(
                      "Lỗi",
                      err.response?.data || "Thuê thất bại",
                      "error"
                    );
                  });
              }}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="modal-header">
                    <h5 className="modal-title">Thuê người CCDV</h5>
                    <button className="btn-close" onClick={onClose}></button>
                  </div>

                  <div className="modal-body">
                    {/* Dịch vụ */}
                    <h5>Dịch vụ cung cấp</h5>
                    <div className="row">
                      {services.map((s) => (
                        <div className="col-md-6 mb-2" key={s.id}>
                          <label className="border rounded p-2 d-flex gap-2">
                            <input
                              type="checkbox"
                              onChange={() =>
                                toggleService(
                                  s.id,
                                  values.startTime,
                                  values.endTime
                                )
                              }
                              checked={selectedServices.includes(s.id)}
                            />
                            <div>
                              <strong>{s.serviceType.name}</strong>
                              <div className="text-danger">
                                {formatMoney(s.totalPrice)} ₫/giờ
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Thời gian */}
                    <div className="mt-3">
                      <label>Thời gian bắt đầu:</label>
                      <Field
                        type="datetime-local"
                        name="startTime"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("startTime", e.target.value);
                          calculateTotal(e.target.value, values.endTime);
                        }}
                      />
                      <ErrorMessage
                        name="startTime"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="mt-3">
                      <label>Thời gian kết thúc:</label>
                      <Field
                        type="datetime-local"
                        name="endTime"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("endTime", e.target.value);
                          calculateTotal(values.startTime, e.target.value);
                        }}
                      />
                      <ErrorMessage
                        name="endTime"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    {/* Địa chỉ */}
                    <div className="mt-3">
                      <label>Địa điểm gặp:</label>
                      <Field
                        type="text"
                        name="address"
                        className="form-control"
                        placeholder="Nhập địa chỉ..."
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    {/* Tin nhắn */}
                    <div className="mt-3">
                      <label>Tin nhắn gửi CCDV:</label>
                      <Field
                        as="textarea"
                        rows="3"
                        name="message"
                        placeholder="Nhập tin nhắn..."
                        className="form-control"
                      />
                    </div>

                    {/* Tổng tiền */}
                    <div className="mt-4 p-3 bg-light rounded border">
                      <h5 className="m-0">
                        Tổng tiền:{" "}
                        <span className="text-danger fw-bold">
                          {formatMoney(totalPrice)} ₫
                        </span>
                      </h5>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                      Đóng
                    </button>
                    <button type="submit" className="btn btn-danger">
                      Xác nhận thuê ❤️
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}
