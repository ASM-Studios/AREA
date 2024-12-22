import React from "react";
import { Row, Col, Card, Typography, Space, Input } from "antd";
import { RobotOutlined, BarChartOutlined, SettingOutlined } from "@ant-design/icons";
import Security from "@/Components/Security";
import LinkButton from "@/Components/LinkButton";
import WorkflowsTable from "@/Components/Workflow/WorkflowsTable";
import { WorkflowTableDetail} from "@/types";
import { instanceWithAuth, workflow, user } from "@Config/backend.routes";
import { toast } from "react-toastify";
import LoadingDots from "@/Components/LoadingDots/LoadingDots";
import { useUser } from "@/Context/ContextHooks";
import { UserPayload } from "@/Context/Scopes/UserContext";

const { Title } = Typography;

interface DashboardData {
    totalAutomations: number | undefined;
    activeAutomations: number | undefined;
    pendingUpdates: number | undefined;
}

const Dashboard: React.FC = () => {
    const [workflows, setWorkflows] = React.useState<WorkflowTableDetail[]>([]);
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [needReload, setNeedReload] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [dashboardData, setDashboardData] = React.useState<DashboardData>({
        totalAutomations: undefined,
        activeAutomations: undefined,
        pendingUpdates: undefined,
    });
    const { setUser, translations } = useUser();

    const fetchWorkflows = () => {
        setLoading(true);
        const _fetchWorkflows = async () => {
            return await instanceWithAuth.get(workflow.list);
        };
        _fetchWorkflows()
            .then((response) => {
                setWorkflows(response.data.workflows);
                setDashboardData({
                    totalAutomations: response.data.workflows.length,
                    activeAutomations: response.data.workflows.filter((w: { is_active: any; }) => w.is_active).length,
                    pendingUpdates: response.data.workflows.filter((w: { status: string; }) => w.status === 'pending').length,
                })
            })
            .catch((error) => {
                console.error(error);
                toast.error(translations?.dashboard.errors.fetchWorkflows);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    React.useEffect(() => {
        setNeedReload(true);
        instanceWithAuth.get(user.me)
            .then((response: { data: UserPayload }) => {
                setUser(response?.data?.user);
            })
            .catch((error) => {
                console.error(error);
                toast.error(translations?.dashboard.errors.fetchUser);
                setUser(null);
            });
    }, []);

    React.useEffect(() => {
        if (needReload) {
            fetchWorkflows();
            setNeedReload(false);
        }
    }, [needReload]);

    const filteredWorkflows = React.useMemo(() => {
        return workflows.filter(workflow => 
            workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [workflows, searchTerm]);

    const filteredDashboardData = React.useMemo(() => ({
        totalAutomations: filteredWorkflows.length,
        activeAutomations: filteredWorkflows.filter(w => w.is_active).length,
        pendingUpdates: filteredWorkflows.filter(w => w.status === 'pending').length,
    }), [filteredWorkflows]);

    return (
        <Security>
            <div style={{padding: 24, position: 'relative', zIndex: 1}} role="main">
                <Row gutter={[24, 24]} style={{marginBottom: 24}}>
                    <Col xs={24} md={8}>
                        <Card>
                            <Space direction="vertical" style={{width: '100%', textAlign: 'center'}}>
                                <RobotOutlined style={{fontSize: 32, color: '#1890ff'}}/>
                                <Title level={2} style={{margin: '8px 0'}}>
                                    {
                                        dashboardData.totalAutomations !== undefined
                                            ? filteredDashboardData.totalAutomations
                                            : <LoadingDots />
                                    }
                                </Title>
                                <Typography.Text type="secondary">{translations?.dashboard.cards.firstCard.title}</Typography.Text>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Space direction="vertical" style={{width: '100%', textAlign: 'center'}}>
                                <BarChartOutlined style={{fontSize: 32, color: '#52c41a'}}/>
                                <Title level={2} style={{margin: '8px 0'}}>
                                    {
                                        dashboardData.activeAutomations !== undefined
                                            ? filteredDashboardData.activeAutomations
                                            : <LoadingDots />
                                    }
                                </Title>
                                <Typography.Text type="secondary">{translations?.dashboard.cards.secondCard.title}</Typography.Text>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Space direction="vertical" style={{width: '100%', textAlign: 'center'}}>
                                <SettingOutlined style={{fontSize: 32, color: '#faad14'}}/>
                                <Title level={2} style={{margin: '8px 0'}}>
                                    {
                                        dashboardData.pendingUpdates !== undefined
                                            ? filteredDashboardData.pendingUpdates
                                            : <LoadingDots />
                                    }
                                </Title>
                                <Typography.Text type="secondary">{translations?.dashboard.cards.thirdCard.title}</Typography.Text>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24}>
                        <Card
                            title={translations?.dashboard.table.title} 
                            extra={
                                <Space style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Input.Search
                                        placeholder={translations?.dashboard.table.searchWorkflows}
                                        onSearch={value => setSearchTerm(value)}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{ width: 400 }}
                                        allowClear
                                    />
                                    <LinkButton text={translations?.dashboard.table.createWorkflow} url="/workflow/create" />
                                </Space>
                            }
                        >
                            <WorkflowsTable
                                workflows={filteredWorkflows}
                                setNeedReload={setNeedReload}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </Security>
    );
};

export default Dashboard;
