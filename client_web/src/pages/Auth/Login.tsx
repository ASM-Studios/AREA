import { Form, Input, Button, Card } from 'antd';
import { Link } from 'react-router-dom';

const Login = () => {
    const onFinish = (values: any) => {
        console.log('Success:', values);
        // Call login API function here
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Card title="Login" style={{ maxWidth: 400, margin: 'auto', marginTop: '100px' }}>
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="Username" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { pattern:
                            /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/,
                            message: 'Password must contain at least one letter, one number, and one special character.'
                        },
                        { min: 8, message: 'Password must be at least 8 characters long.' }
                    ]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Login
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Link to="/register">
                        <Button type="link" style={{ padding: 0 }}>
                            I don't have an account
                        </Button>
                    </Link>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default Login; 