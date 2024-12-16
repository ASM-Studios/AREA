import React, { useState } from "react";
import { Layout, Button, Typography, Space, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
// @ts-expect-error
import { BlockPicker } from "react-color";
import { useAuth, useUser } from "@/Context/ContextHooks";
import OAuthButtons from "@/Components/Auth/OAuthButtons";
import { toast } from "react-toastify";
import Security from "@/Components/Security";
import {instance, instanceWithAuth, oauth} from "@Config/backend.routes";

const { Content } = Layout;
const { Title, Text } = Typography;

interface UserPageProps {
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
}

const UserPage: React.FC<UserPageProps> = ({ backgroundColor, setBackgroundColor }) => {
    const navigate = useNavigate();
    const [tempColor, setTempColor] = useState(backgroundColor);

    const { setJsonWebToken, setIsAuthenticated } = useAuth();
    const { user } = useUser();

    const handleLogout = () => {
        setJsonWebToken("");
        setIsAuthenticated(false);
        navigate("/");
    };

    const handleColorChange = (color: any) => {
        setTempColor(color.hex);
        sessionStorage.setItem('backgroundColor', color.hex);
        setBackgroundColor(color.hex);
    };

    const handleDefaultColor = () => {
        const defaultColor = "#FFA500";
        setTempColor(defaultColor);
        sessionStorage.setItem('backgroundColor', defaultColor);
        setBackgroundColor(defaultColor);
    };

    const handleNotImplemented = () => {
        toast.error("This feature is not implemented yet");
    };

    const onMicrosoftSuccess = (response: any) => {
        instanceWithAuth.post(oauth.microsoft.bind, { "token": response?.accessToken }, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response: { data: { jwt: string; }; }) => {
                if (!response?.data?.jwt) {
                    console.error('JWT not found in response');
                    return;
                }
                toast.success('Successfully connected with Microsoft');
            })
            .catch((error) => {
                console.error('Failed:', error);
                toast.error('Failed to register: ' + (error?.response?.data?.error || 'Network error'));
            });
    };

    const onMicrosoftError = (error: any) => {
        console.error(error);
        toast.error("Failed to connect with Microsoft");
    };

    return (
        <Security>
            <div style={{padding: '16px 24px', position: 'relative', zIndex: 1, height: '100%'}} role="main">
                <Title level={3} style={{marginBottom: 16}}>
                    Create Workflow
                </Title>
                <Content style={{padding: "24px"}}>
                    <Space direction="vertical" size="large" style={{width: "100%"}}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Card title="Profile Information">
                                    <Space direction="vertical">
                                        <Text strong>Welcome, {user?.username || 'User'}!</Text>
                                        <Text>Manage your account settings and connected services here.</Text>
                                    </Space>
                                </Card>
                            </Col>

                            <Col xs={24} md={12}>
                                <Card title="Theme Settings">
                                    <Space direction="vertical" align="center" style={{width: "100%"}}>
                                        <Text>Customize your background color</Text>
                                        <div style={{ border: '1px solid #d9d9d9', padding: '8px', borderRadius: '4px' }}>
                                            <BlockPicker color={tempColor} onChangeComplete={handleColorChange}/>
                                        </div>
                                        <Button onClick={handleDefaultColor}>
                                            Reset to Default Color
                                        </Button>
                                    </Space>
                                </Card>
                            </Col>

                            <Col xs={24}>
                                <Card title="Connected Services">
                                    <Space direction="vertical" style={{width: "100%"}}>
                                        <Text>Connect your accounts to enhance your experience</Text>
                                        <OAuthButtons
                                         mode={"connect"}
                                         onGoogleSuccess={handleNotImplemented}
                                         onGoogleError={handleNotImplemented}
                                         onMicrosoftSuccess={onMicrosoftSuccess}
                                         onMicrosoftError={onMicrosoftError}
                                         onLinkedinSuccess={handleNotImplemented}
                                         onLinkedinError={handleNotImplemented}
                                        />
                                    </Space>
                                </Card>
                            </Col>
                        </Row>

                        <Card>
                            <Space direction="vertical" align="center" style={{width: "100%"}}>
                                <Text type="secondary">Ready to leave?</Text>
                                <Button type="primary" danger onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Space>
                        </Card>
                    </Space>
                </Content>
            </div>
        </Security>
    );
};

export default UserPage;
