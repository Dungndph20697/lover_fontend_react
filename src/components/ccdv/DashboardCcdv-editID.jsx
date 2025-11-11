import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const DashboardCcdv = ({ userId }) => {
    const [tab, setTab] = useState('basic');
    const [services, setServices] = useState({ basic: [], free: [], extended: [] });
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    // Lấy danh sách dịch vụ
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const [basic, free, extended, user] = await Promise.all([
                axios.get('/api/service-options/basic-services'),
                axios.get('/api/service-options/free-services'),
                axios.get('/api/service-options/extended-services'),
                axios.get(`/api/service-options/user/${userId}`)
            ]);
            setServices({
                basic: basic.data,
                free: free.data,
                extended: extended.data
            });
            setSelected(user.data?.selectedServices || []);
            setLoading(false);
        };
        fetchAll();
    }, [userId]);

    // Xử lý chọn dịch vụ
    const handleCheck = (service) => {
        setSelected((prev) =>
            prev.includes(service)
                ? prev.filter((s) => s !== service)
                : [...prev, service]
        );
    };

    // Lưu dịch vụ
    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.post('/api/service-options', {
                userId,
                selectedServices: selected
            });
            setAlert({ type: 'success', msg: 'Cập nhật thành công!' });
        } catch {
            setAlert({ type: 'danger', msg: 'Có lỗi xảy ra!' });
        }
        setLoading(false);
    };

    return (
        <Container className="py-4">
            <h3 className="mb-4">Quản lý dịch vụ của bạn</h3>
            {alert && <Alert variant={alert.type}>{alert.msg}</Alert>}
            <Card>
                <Card.Body>
                    <Tabs activeKey={tab} onSelect={setTab} className="mb-3">
                        <Tab eventKey="basic" title="Dịch vụ cơ bản">
                            {loading ? <Spinner animation="border" /> : (
                                <Form>
                                    {services.basic.map((sv) => (
                                        <Form.Check
                                            key={sv}
                                            type="checkbox"
                                            label={sv}
                                            checked={selected.includes(sv)}
                                            onChange={() => handleCheck(sv)}
                                        />
                                    ))}
                                </Form>
                            )}
                        </Tab>
                        <Tab eventKey="free" title="Dịch vụ miễn phí">
                            {loading ? <Spinner animation="border" /> : (
                                <Form>
                                    {services.free.map((sv) => (
                                        <Form.Check
                                            key={sv}
                                            type="checkbox"
                                            label={sv}
                                            checked={selected.includes(sv)}
                                            onChange={() => handleCheck(sv)}
                                        />
                                    ))}
                                </Form>
                            )}
                        </Tab>
                        <Tab eventKey="extended" title="Dịch vụ mở rộng">
                            {loading ? <Spinner animation="border" /> : (
                                <Form>
                                    {services.extended.map((sv) => (
                                        <Form.Check
                                            key={sv}
                                            type="checkbox"
                                            label={sv}
                                            checked={selected.includes(sv)}
                                            onChange={() => handleCheck(sv)}
                                        />
                                    ))}
                                </Form>
                            )}
                        </Tab>
                    </Tabs>
                    <Button onClick={handleSave} disabled={loading}>Lưu dịch vụ</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DashboardCcdv;