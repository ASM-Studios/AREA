import React, { useState } from "react";
import { Col, Card, Space, Avatar, Typography, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useUser } from "@/Context/ContextHooks";

const { Text } = Typography;

interface ProfileCardProps {
    handleLogout: () => void;
    hoverCount: number;
    setHoverCount: (count: number) => void;
    hoverLimit: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ handleLogout, hoverCount, setHoverCount, hoverLimit }) => {
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

    const { user } = useUser();

    const handleMouseEnter = () => {
        if (hoverCount < hoverLimit) {
            setHoverCount(hoverCount + 1);
            const randomTop = Math.random() * 100;
            const randomLeft = Math.random() * 100;
            setPosition({ top: randomTop, left: randomLeft });
        } else {
            setPosition(null);
        }
    };

    return (
        <Col xs={24} md={12}>
            <Card title="Profile Information" style={{ padding: '16px', height: '100%', position: 'relative' }}>
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <Avatar size={64} icon={<UserOutlined />} />
                    <Text strong>Welcome, {user?.username || 'User'}!</Text>
                    <Text>Manage your account settings and connected services here.</Text>
                </Space>
                <Space direction="vertical" align="center" style={{ width: "100%", paddingTop: "20px" }}>
                    <Text type="secondary">Ready to leave?</Text>
                    <Button
                        type="primary"
                        danger
                        onClick={handleLogout}
                        onMouseEnter={handleMouseEnter}
                        style={{
                            position: 'absolute',
                            top: position ? `${position.top}%` : 'auto',
                            left: position ? `${position.left}%` : '50%',
                            transform: position ? 'none' : 'translateX(-50%)',
                            transition: 'top 0.3s ease, left 0.3s ease',
                        }}
                    >
                        Logout
                    </Button>
                </Space>
            </Card>
        </Col>
    );
};

export default ProfileCard;
