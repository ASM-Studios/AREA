import { FC } from "react";
import { Row, Col, Card, Typography, Space } from "antd";
import { RobotOutlined, BarChartOutlined, SettingOutlined } from "@ant-design/icons";
import Security from "@/Components/Security";
import LinkButton from "@/Components/LinkButton";

const { Title } = Typography;

const Dashboard: FC = () => {
    return (
        <Security>
            <div style={{padding: 24, position: 'relative', zIndex: 1}} role="main">
                <Title level={3} style={{marginBottom: 16}}>
                    Dashboard
                </Title>

                {/* Stats Cards */}
                <Row gutter={[24, 24]} style={{marginBottom: 24}}>
                    <Col xs={24} md={8}>
                        <Card>
                            <Space direction="vertical" style={{width: '100%', textAlign: 'center'}}>
                                <RobotOutlined style={{fontSize: 32, color: '#1890ff'}}/>
                                {/* TODO: Replace X with the number of active automations */}
                                <Title level={2} style={{margin: '8px 0'}}>X</Title>
                                <Typography.Text type="secondary">Active Automations</Typography.Text>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Space direction="vertical" style={{width: '100%', textAlign: 'center'}}>
                                <BarChartOutlined style={{fontSize: 32, color: '#52c41a'}}/>
                                {/* TODO: Replace X with the number of tasks completed */}
                                <Title level={2} style={{margin: '8px 0'}}>X</Title>
                                <Typography.Text type="secondary">Tasks Completed</Typography.Text>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Space direction="vertical" style={{width: '100%', textAlign: 'center'}}>
                                <SettingOutlined style={{fontSize: 32, color: '#faad14'}}/>
                                {/* TODO: Replace X with the number of pending updates */}
                                <Title level={2} style={{margin: '8px 0'}}>X</Title>
                                <Typography.Text type="secondary">Pending Updates</Typography.Text>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Main Content Area */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={16}>
                        <Card title="Recent Activity" style={{height: 400}}>
                            {/* Activity content would go here */}
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card title="Quick Actions" style={{height: 400}}>
                            <Space direction="vertical" size="middle" style={{width: '100%'}}>
                                <LinkButton text="Create A Workflow" url="/workflow/create" style={{width: '100%'}}/>
                                <LinkButton text="View All Workflows" url="/workflows" style={{width: '100%'}}/>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Security>
    );
};

export default Dashboard;
