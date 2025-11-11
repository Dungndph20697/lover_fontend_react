import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';
import '../admin/AdminEnhancements.css';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const [notifications, setNotifications] = useState(5);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="admin-layout">
            {/* Admin Navbar */}
            <Navbar bg="dark" variant="dark" expand="lg" className="admin-navbar">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/admin/dashboard" className="admin-brand">
                        🚀 Admin Panel
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="admin-navbar-nav" />

                    <Navbar.Collapse id="admin-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link
                                as={Link}
                                to="/admin/dashboard"
                                className={location.pathname === '/admin/dashboard' ? 'active' : ''}
                            >
                                📊 Dashboard
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/admin/orders"
                                className={location.pathname === '/admin/orders' ? 'active' : ''}
                            >
                                📋 Đơn hàng
                                {notifications > 0 && (
                                    <Badge bg="danger" className="ms-1">{notifications}</Badge>
                                )}
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/admin/users"
                                className={location.pathname === '/admin/users' ? 'active' : ''}
                            >
                                👥 Người dùng
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/admin/reports"
                                className={location.pathname === '/admin/reports' ? 'active' : ''}
                            >
                                📈 Báo cáo
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/admin/settings"
                                className={location.pathname === '/admin/settings' ? 'active' : ''}
                            >
                                ⚙️ Cài đặt
                            </Nav.Link>
                        </Nav>

                        <Nav className="align-items-center">
                            {/* Current Time Display */}
                            <div className="text-white me-3 d-none d-lg-block">
                                <small>🕐 {formatTime(currentTime)}</small>
                            </div>

                            {/* Notifications Dropdown */}
                            <Dropdown className="me-3">
                                <Dropdown.Toggle variant="outline-light" size="sm" className="position-relative">
                                    🔔 Thông báo
                                    {notifications > 0 && (
                                        <span className="notification-badge">{notifications}</span>
                                    )}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item>
                                        <strong>📋 Đơn mới</strong><br />
                                        <small className="text-muted">5 đơn cần duyệt</small>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <strong>👤 Tài khoản mới</strong><br />
                                        <small className="text-muted">3 CCDV đăng ký</small>
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item className="text-center">
                                        <small>Xem tất cả</small>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            {/* Admin Profile Dropdown */}
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="outline-light" id="admin-dropdown">
                                    👤 Admin
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-3">
                                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                    <span className="text-white fw-bold">A</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="fw-bold">Admin User</div>
                                                <small className="text-muted">admin@lover.com</small>
                                            </div>
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item>
                                        ⚙️ Cài đặt
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        👤 Hồ sơ
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        🌙 Chế độ tối
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                                        🚪 Đăng xuất
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Main Content */}
            <main className="admin-main">
                {children}
            </main>

            {/* Modern Footer */}
            <footer className="admin-footer">
                <Container>
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start">
                            <div className="gradient-text fw-bold">
                                © 2024 Lover Admin Panel
                            </div>
                            <small>Phiên bản 2.0.1</small>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <small>
                                🚀 Hiệu năng cao | 🔒 Bảo mật | 💎 Hiện đại
                            </small>
                        </div>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default AdminLayout;
