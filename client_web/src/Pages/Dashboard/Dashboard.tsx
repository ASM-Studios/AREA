import { FC } from "react";
import { Row, Col, Card, Typography, Space } from "antd";
import { RobotOutlined, BarChartOutlined, SettingOutlined } from "@ant-design/icons";
import Security from "../../components/Security";

const { Title } = Typography;

const Dashboard: FC = () => {
    return (
        <Security>
            <div style={{ padding: 24 }}>
                {/* Header */}
                <Title level={3} style={{ marginBottom: 24 }}>
                    Dashboard
                </Title>

                {/* Stats Cards */}
                <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                    <Col xs={24} md={8}>
                        <Card>
                            <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                                <RobotOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                                <Title level={2} style={{ margin: '8px 0' }}>12</Title>
                                <Typography.Text type="secondary">Active Automations</Typography.Text>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                                <BarChartOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                                <Title level={2} style={{ margin: '8px 0' }}>1,234</Title>
                                <Typography.Text type="secondary">Tasks Completed</Typography.Text>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                                <SettingOutlined style={{ fontSize: 32, color: '#faad14' }} />
                                <Title level={2} style={{ margin: '8px 0' }}>5</Title>
                                <Typography.Text type="secondary">Pending Updates</Typography.Text>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Main Content Area */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={16}>
                        <Card title="Recent Activity" style={{ height: 400 }}>
                            {/* Activity content would go here */}
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card title="Quick Actions" style={{ height: 400 }}>
                            {/* Quick actions content would go here */}
                        </Card>
                    </Col>
                </Row>
            </div>
        </Security>
    );
};

export default Dashboard;
