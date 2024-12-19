import React, { useState } from "react";
import { Layout, Button, Typography, Space, Card, Row, Col, Avatar, List } from "antd";
import { useNavigate } from "react-router-dom";
// @ts-expect-error
import { BlockPicker } from "react-color";
import { useAuth, useUser } from "@/Context/ContextHooks";
import OAuthButtons from "@/Components/Auth/OAuthButtons";
import { toast } from "react-toastify";
import Security from "@/Components/Security";
import { instanceWithAuth, oauth, user as userRoute } from "@Config/backend.routes";
import { UserPayload } from "@/Context/Scopes/UserContext";
import { UserOutlined, BgColorsOutlined } from "@ant-design/icons";
import ProfileCard from "@/Components/User/ProfileCard";

const { Content } = Layout;
const { Text } = Typography;

interface UserPageProps {
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
}

const hoverLimit = 4;

const UserPage: React.FC<UserPageProps> = ({ backgroundColor, setBackgroundColor }) => {
    const navigate = useNavigate();
    const [tempColor, setTempColor] = useState(backgroundColor);
    const [hoverCount, setHoverCount] = useState(0);

    const { setJsonWebToken, setIsAuthenticated } = useAuth();
    const { user, setUser } = useUser();

    React.useEffect(() => {
        instanceWithAuth.get(userRoute.me)
            .then((response: { data: UserPayload }) => {
                setUser(response?.data?.user);
            })
            .catch((error) => {
                console.error("error: ", error);
                toast.error("Failed to fetch user data");
            });
    }, []);

    const handleLogout = () => {
        if (hoverCount < hoverLimit) { return; }
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

    return (
        <Security>
            <div style={{ padding: '16px 24px', position: 'relative', zIndex: 1, height: '100%' }} role="main">

                <Content style={{ padding: "24px" }}>
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <Row gutter={[16, 16]}>
                            <ProfileCard
                                handleLogout={handleLogout}
                                hoverCount={hoverCount}
                                setHoverCount={setHoverCount}
                                hoverLimit={hoverLimit}
                            />

                            <Col xs={24} md={12}>
                                <Card title="Theme Settings" style={{ padding: '16px', height: '100%' }}>
                                    <Space direction="vertical" align="center" style={{ width: '100%' }}>
                                        <Text>Customize your background color</Text>
                                        <div style={{ border: '1px solid #d9d9d9', padding: '8px', borderRadius: '4px' }}>
                                            <BlockPicker color={tempColor} onChangeComplete={handleColorChange} />
                                        </div>
                                        <Button icon={<BgColorsOutlined />} onClick={handleDefaultColor}>
                                            Reset to Default Color
                                        </Button>
                                    </Space>
                                </Card>
                            </Col>

                            <Col xs={24}>
                                <Card title="Connected Services" style={{ padding: '16px' }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text>Connect your accounts to enhance your experience</Text>
                                        <Row gutter={[16, 16]} style={{ paddingTop: '15px' }}>
                                            <Col xs={24} md={12}>
                                                <Space direction="vertical" style={{ width: '100%' }}>
                                                    <OAuthButtons
                                                        mode={"connect"}
                                                        onGoogleSuccess={handleNotImplemented}
                                                        onGoogleError={handleNotImplemented}
                                                    />
                                                </Space>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Space direction="vertical" style={{ width: '100%' }}>
                                                    <Text strong style={{ marginBottom: '8px' }}>Connected Services:</Text>
                                                    <List
                                                        dataSource={user?.services || []}
                                                        renderItem={(service) => (
                                                            <List.Item>
                                                                <List.Item.Meta
                                                                    avatar={<Avatar icon={<UserOutlined />} />}
                                                                    title={service.name}
                                                                    description={`Connected on ${new Date(service.connectedAt).toLocaleDateString()}`}
                                                                />
                                                            </List.Item>
                                                        )}
                                                    />
                                                </Space>
                                            </Col>
                                        </Row>
                                    </Space>
                                </Card>
                            </Col>
                        </Row>
                    </Space>
                </Content>
            </div>
        </Security>
    );
};

export default UserPage;
