import React from "react";
import { Row, Typography, Spin, Space } from "antd";
// @ts-ignore
import Security from "@/Components/Security.tsx";
// @ts-ignore
import LinkButton from "@/Components/LinkButton.tsx";

// @ts-ignore
import { Workflow } from "@/types";

const { Title } = Typography;

const WorkflowTable: React.FC = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [_, setWorkflows] = React.useState<Workflow[]>([]);

    React.useEffect(() => {
        setLoading(true);
        setWorkflows([]); // TODO: Fetch workflows from the server
        setLoading(false);
    }, []);

    return (
        <Security>
            <div style={{padding: 24, position: 'relative', zIndex: 1}} role="main">
                <Title level={3} style={{marginBottom: 24}}>
                    Create Workflow
                </Title>

                {loading ? (
                    <Spin size="large" />
                ) : (
                    <>
                        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                            <Typography.Text>
                                This is where you see all your workflows.
                            </Typography.Text>
                        </Row>
                        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                            <Space>
                                <LinkButton text="Go Back" goBack type="default" />
                            </Space>
                        </Row>
                    </>
                )}
            </div>
        </Security>
    );
};

export default WorkflowTable;
