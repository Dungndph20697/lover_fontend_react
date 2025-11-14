import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function GuideModal({ show, onHide }) {
    return (
        <Modal show={show} onHide={onHide} centered className="fade-in">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>💡 Hướng dẫn sử dụng dịch vụ</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>
                    Chào mừng bạn đến với <strong>Lover CCDV</strong> 💖
                    <br />
                    Dưới đây là một số hướng dẫn giúp bạn dễ dàng bắt đầu cung cấp dịch vụ:
                </p>

                <ul>
                    <li>
                        <strong>🌿 Dịch vụ cơ bản:</strong>
                        <span className="text-muted">
                            &nbsp;Bắt buộc kích hoạt. Là nền tảng chính để bạn bắt đầu cung cấp dịch vụ.
                        </span>
                    </li>

                    <li>
                        <strong>💚 Dịch vụ miễn phí:</strong>
                        <span className="text-muted">
                            &nbsp;Những tiện ích nhỏ đi kèm, giúp bạn thể hiện sự thân thiện và chuyên nghiệp mà không tính phí.
                        </span>
                    </li>

                    <li>
                        <strong>💎 Dịch vụ mở rộng:</strong>
                        <span className="text-muted">
                            &nbsp;Các gói dịch vụ nâng cao mang lại thu nhập tốt hơn. Bạn có thể tùy chỉnh giá cho từng loại.
                        </span>
                    </li>
                </ul>

                <p className="mt-3 text-muted small">
                    💬 Sau khi đăng ký, bạn có thể xem lại hoặc chỉnh sửa giá dịch vụ tại mục{" "}
                    <em>“Xem dịch vụ đã đăng ký”</em>.
                    <br />Hãy chọn các dịch vụ phù hợp để thể hiện phong cách và giá trị riêng của bạn.
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={onHide}>
                    Đã hiểu rõ 👍
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
