import React from 'react';
import { Layout, Typography, Row, Col, Button, Card } from 'antd';
import { ThunderboltOutlined, ApiOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { instance, root } from "@Config/backend.routes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@/Context/ContextHooks";

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
  const { translations } = useUser();

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
                {translations?.home?.title}
              </Title>
              <Paragraph style={{ color: 'white', fontSize: 18, marginBottom: 32 }}>
                {translations?.home?.description}
              </Paragraph>
              <Button type="primary" disabled={!pingResponse} onClick={() => { handleGetStarted() }}>
                {translations?.home?.getStarted}
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
                  <Title level={4}>{translations?.home?.upperCards?.firstCard?.title}</Title>
                  <Paragraph>
                    {translations?.home?.upperCards?.firstCard?.description}
                  </Paragraph>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} md={8}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card>
                  <ApiOutlined style={{ fontSize: 32, color: backgroundColor, marginBottom: 16 }} />
                  <Title level={4}>{translations?.home?.upperCards?.secondCard?.title}</Title>
                  <Paragraph>
                    {translations?.home?.upperCards?.secondCard?.description}
                  </Paragraph>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} md={8}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card>
                  <SafetyCertificateOutlined style={{ fontSize: 32, color: backgroundColor, marginBottom: 16 }} />
                  <Title level={4}>{translations?.home?.upperCards?.thirdCard?.title}</Title>
                  <Paragraph>
                    {translations?.home?.upperCards?.thirdCard?.description}
                  </Paragraph>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Content>

        <div style={{ background: '#f5f5f5', padding: '64px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Row gutter={[32, 32]}>
              {[
                { step: '1', title: translations?.home?.lowerCards?.firstCard?.title, description: translations?.home?.lowerCards?.firstCard?.description },
                { step: '2', title: translations?.home?.lowerCards?.secondCard?.title, description: translations?.home?.lowerCards?.secondCard?.description },
                { step: '3', title: translations?.home?.lowerCards?.thirdCard?.title, description: translations?.home?.lowerCards?.thirdCard?.description },
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
