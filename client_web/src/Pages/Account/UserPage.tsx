import React, { useState } from "react";
import { Layout, Button, Typography, Space, Card, Row, Col, Avatar, List, Input, Table } from "antd";
import { useNavigate } from "react-router-dom";
// @ts-expect-error
import { BlockPicker } from "react-color";
import { useAuth, useUser } from "@/Context/ContextHooks";
import OAuthButtons from "@/Components/Auth/OAuthButtons";
import { toast } from "react-toastify";
import Security from "@/Components/Security";
import { instanceWithAuth, user as userRoute, secret } from "@Config/backend.routes";
import { UserPayload } from "@/Context/Scopes/UserContext";
import { UserOutlined, BgColorsOutlined, DeleteOutlined } from "@ant-design/icons";
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
    const [tempColor, setTempColor] = useState<string>(backgroundColor);
    const [hoverCount, setHoverCount] = useState<number>(0);
    const [needReload, setNeedReload] = useState<boolean>(false);
    const [secrets, setSecrets] = useState<Array<{ id: string, name: string }>>([]);
    const [newSecretName, setNewSecretName] = useState<string>("");
    const [isLoadingSecrets, setIsLoadingSecrets] = useState<boolean>(false);

    const { setJsonWebToken, setIsAuthenticated } = useAuth();
    const { user, setUser, translations } = useUser();

    React.useEffect(() => {
        if (!needReload) return;

        instanceWithAuth.get(userRoute.me)
            .then((response: { data: UserPayload }) => {
                setUser(response?.data?.user);
                setNeedReload(false);
            })
            .catch((error) => {
                console.error("error: ", error);
                toast.error("Failed to fetch user data");
                setNeedReload(false);
            });
    }, [needReload]);

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

    const fetchSecrets = () => {
        setIsLoadingSecrets(true);
        instanceWithAuth.get(secret.list)
            .then((response) => {
                setSecrets(response.data);
                setIsLoadingSecrets(false);
            })
            .catch((error) => {
                console.error('Failed to fetch secrets:', error);
                setIsLoadingSecrets(false);
                toast.error("Failed to fetch secrets");
            });
    };

    const handleCreateSecret = () => {
        if (!newSecretName.trim()) {
            toast.error("Secret name cannot be empty");
            return;
        }

        instanceWithAuth.post(secret.create, { name: newSecretName })
            .then(() => {
                toast.success("Secret created successfully");
                setNewSecretName("");
                fetchSecrets();
            })
            .catch((error) => {
                console.error('Failed to create secret:', error);
                toast.error("Failed to create secret");
            });
    };

    const handleDeleteSecret = (id: string) => {
        instanceWithAuth.delete(`${secret.delete}/${id}`)
            .then(() => {
                toast.success("Secret deleted successfully");
                fetchSecrets();
            })
            .catch((error) => {
                console.error('Failed to delete secret:', error);
                toast.error("Failed to delete secret");
            });
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
                                setNeedReload={setNeedReload}
                            />

                            <Col xs={24} md={12}>
                                <Card title={translations?.userPage?.themeSettings?.title} style={{ padding: '16px', height: '100%' }}>
                                    <Space direction="vertical" align="center" style={{ width: '100%' }}>
                                        <Text>{translations?.userPage?.themeSettings?.description}</Text>
                                        <div style={{ border: '1px solid #d9d9d9', padding: '8px', borderRadius: '4px' }}>
                                            <BlockPicker color={tempColor} onChangeComplete={handleColorChange} />
                                        </div>
                                        <Button icon={<BgColorsOutlined />} onClick={handleDefaultColor}>
                                            {translations?.userPage?.themeSettings?.resetButton}
                                        </Button>
                                    </Space>
                                </Card>
                            </Col>

                            <Col xs={24}>
                                <Card title={translations?.userPage?.connectedServices?.title} style={{ padding: '16px' }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text>{translations?.userPage?.connectedServices?.description}</Text>
                                        <Row gutter={[16, 16]} style={{ paddingTop: '15px' }}>
                                            <Col xs={24} md={12}>
                                                <Space direction="vertical" style={{ width: '100%' }}>
                                                    <OAuthButtons
                                                        mode={"connect"}
                                                    />
                                                </Space>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Space direction="vertical" style={{ width: '100%' }}>
                                                    <Text strong style={{ marginBottom: '8px' }}>{translations?.userPage?.connectedServices?.connectedServices}:</Text>
                                                    <List
                                                        dataSource={user?.services || []}
                                                        renderItem={(service) => (
                                                            <List.Item>
                                                                <List.Item.Meta
                                                                    avatar={<Avatar icon={<UserOutlined />} />}
                                                                    title={service.name}
                                                                    description={
                                                                        `${translations?.userPage?.connectedServices?.connectedAt} 
                                                                        ${new Date(service.connectedAt).toLocaleDateString()}`
                                                                    }
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

                            <Col xs={24}>
                                <Card title={translations?.userPage?.profileCard?.secretsManagement} style={{ padding: '16px' }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Space.Compact style={{ width: '100%' }}>
                                            <Input
                                                placeholder="Enter secret name"
                                                value={newSecretName}
                                                onChange={(e) => setNewSecretName(e.target.value)}
                                            />
                                            <Button type="primary" onClick={handleCreateSecret}>
                                                Create Secret
                                            </Button>
                                        </Space.Compact>
                                        
                                        <Table
                                            loading={isLoadingSecrets}
                                            dataSource={secrets}
                                            columns={[
                                                {
                                                    title: 'Name',
                                                    dataIndex: 'name',
                                                    key: 'name',
                                                },
                                                {
                                                    title: 'Actions',
                                                    key: 'actions',
                                                    render: (_, record) => (
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => handleDeleteSecret(record.id)}
                                                        />
                                                    ),
                                                },
                                            ]}
                                            pagination={false}
                                            rowKey="id"
                                        />
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
