import React from 'react';
import { Layout, Typography, Row, Col, Button, Card } from 'antd';
import { ThunderboltOutlined, ApiOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { instance, root } from "@Config/backend.routes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/ContextHooks";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface HomeProps {
  backgroundColor: string;
}

const Home: React.FC<HomeProps> = ({ backgroundColor }) => {
  const [pingResponse, setPingResponse] = React.useState<boolean>(false);
  const hasPinged = React.useRef(false);
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const ping =  () => {
    instance.get(root.ping)
        .then((_) => {
          setPingResponse(true);
        })
        .catch((error) => {
          setPingResponse(false);
          console.error(error);
          toast.error('Failed to ping the server');
        });
  };

  React.useEffect(() => {
    if (!hasPinged.current) {
      ping();
      hasPinged.current = true;
    }
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
      <Layout>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '64px 0',
            }}
        >
          <Row justify="center" align="middle" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Col xs={24} md={12}>
              <Title level={1} style={{ color: 'white', marginBottom: 24 }}>
                Connect Your Digital World
              </Title>
              <Paragraph style={{ color: 'white', fontSize: 18, marginBottom: 32 }}>
                Automate your life by connecting your favorite services. Create powerful automation flows with just a few clicks.
              </Paragraph>
              <Button type="primary" disabled={!pingResponse} onClick={() => { handleGetStarted() }}>
                Get Started
              </Button>
            </Col>
            <Col xs={24} md={12}>
              <img
                  src="/automation.png"
                  alt="Automation Illustration"
                  style={{ width: '100%', maxWidth: 500 }}
              />
            </Col>
          </Row>
        </motion.div>

        <Content style={{ padding: '64px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card>
                  <ThunderboltOutlined style={{ fontSize: 32, color: backgroundColor, marginBottom: 16 }} />
                  <Title level={4}>Easy Automation</Title>
                  <Paragraph>
                    Create powerful automation workflows with no coding required!
                  </Paragraph>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} md={8}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card>
                  <ApiOutlined style={{ fontSize: 32, color: backgroundColor, marginBottom: 16 }} />
                  <Title level={4}>Connect Services</Title>
                  <Paragraph>
                    Integrate with popular services and apps. Make them work together seamlessly.
                  </Paragraph>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} md={8}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card>
                  <SafetyCertificateOutlined style={{ fontSize: 32, color: backgroundColor, marginBottom: 16 }} />
                  <Title level={4}>Secure & Reliable</Title>
                  <Paragraph>
                    Your data is protected with enterprise-grade security. Run your automations with confidence.
                  </Paragraph>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Content>

        <div style={{ background: '#f5f5f5', padding: '64px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
              How It Works
            </Title>
            <Row gutter={[32, 32]}>
              {[
                { step: '1', title: 'Choose a Trigger', description: 'Select an event that starts your automation' },
                { step: '2', title: 'Add Actions', description: 'Define what happens when the trigger fires' },
                { step: '3', title: 'Watch It Work', description: 'Sit back and let Area handle the rest' },
              ].map((item) => (
                  <Col xs={24} md={8} key={item.step}>
                    <motion.div whileHover={{ y: -10 }} style={{ textAlign: 'center' }}>
                      <Card>
                        <Title
                            style={{
                              color: backgroundColor,
                              opacity: 0.2,
                              fontSize: 64,
                              marginBottom: 16
                            }}
                        >
                          {item.step}
                        </Title>
                        <Title level={4}>{item.title}</Title>
                        <Paragraph>{item.description}</Paragraph>
                      </Card>
                    </motion.div>
                  </Col>
              ))}
            </Row>
          </div>
        </div>
      </Layout>
  );
};

export default Home;
