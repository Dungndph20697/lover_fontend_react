import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Tabs, Tab, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { apiURL } from '../../config/api';

const serviceBase = `${apiURL}/service-options`;

const BASIC_SERVICES = [
    'Ra mắt người nhà',
    'Ra mắt bạn bè',
    'Du lịch chung cùng nhóm bạn',
    'Đi chơi chung',
    'Tham dự sinh nhật',
    'Trò chuyện offline',
    'Trò chuyện online',
    'Đi chơi tết',
    'Đi chơi ngày lễ'
];

const FREE_SERVICES = ['Nắm tay', 'Nói yêu', 'Nhìn mắt'];

const EXTENDED_SERVICES = ['Nắm tay', 'Hôn tay', 'Ôm', 'Nhõng nhẽo', 'Cử chỉ thân mật', 'Nói lời yêu'];

const COST_INFO = ['Tiền theo tiếng: 1 tiếng 70k', 'Thuê ít nhất là 1 tiếng hay 0.5 tiếng'];

const DashboardCcdv = () => {
    const { userId } = useParams();
    const [tab, setTab] = useState('basic');
    const [services, setServices] = useState({ basic: [], free: [], extended: [] });
    const [selected, setSelected] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (!userId) {
            setAlert({ type: 'danger', msg: 'Không tìm thấy người dùng.' });
            setFetching(false);
            return;
        }

        const controller = new AbortController();

        const normalizeList = (response) => {
            const payload = response?.data;
            if (Array.isArray(payload)) return payload;
            if (Array.isArray(payload?.data)) return payload.data;
            if (Array.isArray(payload?.services)) return payload.services;
            return [];
        };

        const fetchAll = async () => {
            setFetching(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setAlert({ type: 'warning', msg: 'Vui lòng đăng nhập để xem danh sách dịch vụ.' });
                    setFetching(false);
                    return;
                }
                const requestConfig = {
                    signal: controller.signal,
                    headers: { Authorization: `Bearer ${token}` }
                };
                const [basic, free, extended, user] = await Promise.all([
                    axios.get(`${serviceBase}/basic-services`, requestConfig),
                    axios.get(`${serviceBase}/free-services`, requestConfig),
                    axios.get(`${serviceBase}/extended-services`, requestConfig),
                    axios.get(`${serviceBase}/user/${userId}`, requestConfig)
                ]);
                setServices({
                    basic: normalizeList(basic),
                    free: normalizeList(free),
                    extended: normalizeList(extended)
                });
                const selectedFromServer = user?.data?.selectedServices;
                setSelected(Array.isArray(selectedFromServer) ? selectedFromServer : []);
                setAlert(null);
            } catch (error) {
                if (controller.signal.aborted) return;
                setAlert({
                    type: 'danger',
                    msg: error.response?.data?.message || 'Lỗi tải dữ liệu!'
                });
            } finally {
                if (!controller.signal.aborted) {
                    setFetching(false);
                }
            }
        };

        fetchAll();

        return () => controller.abort();
    }, [userId]);

    const handleCheck = (service) => {
        setSelected((prev) =>
            prev.includes(service)
                ? prev.filter((s) => s !== service)
                : [...prev, service]
        );
    };

    const staticInfo = useMemo(() => ([
        { title: 'Các dịch vụ cơ bản (*)', items: BASIC_SERVICES },
        { title: 'Dịch vụ miễn phí', items: FREE_SERVICES },
        { title: 'Dịch vụ mở rộng', items: EXTENDED_SERVICES },
        { title: 'Chi phí', items: COST_INFO }
    ]), []);

    const handleSave = async () => {
        if (!userId) return;
        const token = localStorage.getItem('token');
        if (!token) {
            setAlert({ type: 'warning', msg: 'Vui lòng đăng nhập để lưu thay đổi.' });
            return;
        }
        setSaving(true);
        try {
            await axios.post(`${serviceBase}`, {
                userId,
                selectedServices: selected
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlert({ type: 'success', msg: 'Thêm dữ liệu thành công.' });
        } catch (error) {
            setAlert({
                type: 'danger',
                msg: error.response?.data?.message || 'Có lỗi xảy ra!'
            });
        }
        setSaving(false);
    };

    const renderList = (items) => (
        <Form>
            <Row className="g-2">
                {(Array.isArray(items) ? items : []).map((sv) => (
                    <Col xs={12} md={6} key={sv}>
                        <div className="border rounded-3 px-3 py-2 d-flex align-items-center shadow-sm bg-light">
                            <Form.Check
                                type="checkbox"
                                label={sv}
                                checked={selected.includes(sv)}
                                onChange={() => handleCheck(sv)}
                                className="fw-semibold"
                            />
                        </div>
                    </Col>
                ))}
            </Row>
        </Form>
    );

    return (
        <Container className="py-4">
            <Row className="g-3">
                <Col lg={5}>
                    <h3 className="mb-3">Quản lý dịch vụ của bạn</h3>
                    {alert && <Alert variant={alert.type}>{alert.msg}</Alert>}
                    <Card className="h-100 shadow-sm border-0">
                        <Card.Body>
                            <h5 className="mb-3">Thông tin dịch vụ</h5>
                            {staticInfo.map((section) => (
                                <div key={section.title} className="mb-3">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <Badge bg="secondary">{section.title}</Badge>
                                    </div>
                                    <ul className="mb-0 ps-4 text-muted small">
                                        {section.items.map((item) => (
                                            <li key={item} className="mb-1">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={7}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body>
                            <Tabs activeKey={tab} onSelect={setTab} className="mb-3">
                                <Tab eventKey="basic" title="Dịch vụ cơ bản">
                                    {fetching ? <Spinner animation="border" /> : renderList(services.basic)}
                                </Tab>
                                <Tab eventKey="free" title="Dịch vụ miễn phí">
                                    {fetching ? <Spinner animation="border" /> : renderList(services.free)}
                                </Tab>
                                <Tab eventKey="extended" title="Dịch vụ mở rộng">
                                    {fetching ? <Spinner animation="border" /> : renderList(services.extended)}
                                </Tab>
                            </Tabs>
                            <div className="d-flex justify-content-end">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving || fetching}
                                    variant="primary"
                                >
                                    {saving ? 'Đang lưu...' : 'Lưu dịch vụ'}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardCcdv;
