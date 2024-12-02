import { Layout, Typography, Row, Col, Button, Card } from 'antd';
import { ThunderboltOutlined, ApiOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: 'linear-gradient(45deg, #1890ff 30%, #69c0ff 90%)',
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
            <Link to="/login">
              <Button type="primary" size="large" style={{ background: 'white', borderColor: 'white', color: 'black' }}>
                Get Started
              </Button>
            </Link>
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

      {/* Features Section */}
      <Content style={{ padding: '64px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card>
                <ThunderboltOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
                <Title level={4}>Easy Automation</Title>
                <Paragraph>
                  Create powerful automation workflows with our intuitive drag-and-drop interface.
                  No coding required!
                </Paragraph>
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} md={8}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card>
                <ApiOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
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
                <SafetyCertificateOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
                <Title level={4}>Secure & Reliable</Title>
                <Paragraph>
                  Your data is protected with enterprise-grade security. Run your automations with confidence.
                </Paragraph>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Content>

      {/* How It Works Section */}
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
                  <Title
                    style={{ 
                      color: '#1890ff',
                      opacity: 0.2,
                      fontSize: 64,
                      marginBottom: 16
                    }}
                  >
                    {item.step}
                  </Title>
                  <Title level={4}>{item.title}</Title>
                  <Paragraph>{item.description}</Paragraph>
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
