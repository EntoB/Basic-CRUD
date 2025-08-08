import { Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <Row gutter={16} justify="center" style={{ marginTop: 100 }}>
            <Col>
                <Card
                    title="Manage Departments"
                    hoverable
                    style={{ width: 240 }}
                    onClick={() => navigate('/departments')}
                >
                    View, add, and edit departments.
                </Card>
            </Col>
            <Col>
                <Card
                    title="Manage Employees"
                    hoverable
                    style={{ width: 240 }}
                    onClick={() => navigate('/employees')}
                >
                    View, add, and edit employees.
                </Card>
            </Col>
        </Row>
    );
};

export default Home;