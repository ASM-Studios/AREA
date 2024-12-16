import React, { useState } from "react";
import { Button, Row, Typography, Spin, Space, Card, List, Form, Input, Col, Collapse } from "antd";
import Security from "@/Components/Security";
import LinkButton from "@/Components/LinkButton";
import { normalizeName } from "@/Pages/Workflows/CreateWorkflow.utils";
import { createWorkflowUtils } from "./Workflow.utils";
import { useParams } from "react-router-dom";

import { About, Service, Action, Reaction, Workflow, Parameter, SelectedAction, SelectedReaction } from "@/types";
import { toast } from "react-toastify";
import { instanceWithAuth, workflow as workflowRoute, root } from "@/Config/backend.routes";
import { useError } from "@/Context/ContextHooks";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const UpdateWorkflow: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [about, setAbout] = React.useState<About | null>(null);
    const [selectedActions, setSelectedActions] = React.useState<SelectedAction[]>([]);
    const [selectedReactions, setSelectedReactions] = React.useState<SelectedReaction[]>([]);
    const [workflowName, setWorkflowName] = React.useState<string>('');
    const [workflowDescription, setWorkflowDescription] = React.useState<string>('');
    const [workflowNameTouched, setWorkflowNameTouched] = React.useState<boolean>(false);
    const [activeActionKeys, setActiveActionKeys] = useState<string[]>([]);
    const [activeReactionKeys, setActiveReactionKeys] = useState<string[]>([]);

    const { setError } = useError();
    const navigate = useNavigate();

    const workflowUtils = createWorkflowUtils({
        about,
        setSelectedActions,
        setSelectedReactions,
        setActiveActionKeys,
        setActiveReactionKeys,
    });

    React.useEffect(() => {
        setLoading(true);
        Promise.all([
            instanceWithAuth.get(root.about),
            instanceWithAuth.get(`${workflowRoute.get}/${id}`)
        ])
            .then(([aboutResponse, workflowResponse]) => {
                setAbout(aboutResponse?.data);
                const workflow = workflowResponse?.data?.workflow;

                if (!workflow) {
                    setError({ error: "Workflow not found", errorDescription: "The workflow you are trying to update does not exist" });
                    navigate('/error/not-found');
                    return;
                }

                setWorkflowName(workflow.name);
                setWorkflowDescription(workflow.description);

                const actions = workflow.events.filter((event: { type: string }) => event.type === 'action');
                const reactions = workflow.events.filter((event: { type: string }) => event.type === 'reaction');

                interface WorkflowEvent {
                    id: number;
                    name: string;
                    description: string;
                    parameters: {
                        name: string;
                        value: string | number;
                        type: "string" | "number" | "datetime";
                    }[];
                }

                setSelectedActions(actions.map((action: WorkflowEvent) => ({
                    id: action.id,
                    name: action.name,
                    description: action.description,
                    parameters: action.parameters.reduce<Record<string, string | number>>((acc, param) => ({
                        ...acc,
                        [param.name]: param.value
                    }), {})
                })));

                setSelectedReactions(reactions.map((reaction: WorkflowEvent) => ({
                    id: reaction.id,
                    name: reaction.name,
                    description: reaction.description,
                    parameters: reaction.parameters.reduce<Record<string, string | number>>((acc, param) => ({
                        ...acc,
                        [param.name]: param.value
                    }), {})
                })));
            })
            .catch((error) => {
                console.error(error);
                setError({ error: "API Error", errorDescription: "Could not fetch workflow data" });
                navigate('/error/fetch');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleUpdateWorkflow = () => {
        const workflow: Workflow = {
            name: workflowName,
            description: workflowDescription,
            services: [...new Set([
                ...selectedActions.map(action => {
                    const service = about?.server.services.find(s =>
                        s.actions.some(a => a.name === action.name)
                    );
                    return service?.id;
                }),
                ...selectedReactions.map(reaction => {
                    const service = about?.server.services.find(s =>
                        s.reactions.some(r => r.name === reaction.name)
                    );
                    return service?.id;
                })
            ])].filter(id => id !== undefined) as number[],
            events: [
                ...selectedActions.map(action => {
                    const actionDef = about?.server.services
                        .flatMap((s: Service) => s.actions)
                        .find((a: Action) => a.name === action.name);

                    return {
                        id: action.id,
                        name: action.name,
                        type: 'action' as "action",
                        description: action.description,
                        parameters: Object.entries(action.parameters || {}).map(([name, value]) => {
                            const paramDef = actionDef?.parameters.find((p: Parameter) => p.name === name);
                            return {
                                name,
                                type: paramDef?.type || 'string' as "string" | "number" | "datetime",
                                value
                            };
                        })
                    };
                }),
                ...selectedReactions.map(reaction => {
                    const reactionDef = about?.server.services
                        .flatMap((s: Service) => s.reactions)
                        .find((r: Reaction) => r.name === reaction.name);

                    return {
                        id: reaction.id,
                        name: reaction.name,
                        type: 'reaction' as "reaction",
                        description: reaction.description,
                        parameters: Object.entries(reaction.parameters || {}).map(([name, value]) => {
                            const paramDef = reactionDef?.parameters.find((p: Parameter) => p.name === name);
                            return {
                                name,
                                type: paramDef?.type || 'string' as "string" | "number" | "datetime",
                                value
                            };
                        })
                    };
                })
            ]
        }

        instanceWithAuth.put(`${workflowRoute.update}/${id}`, workflow)
            .then(() => {
                toast.success("Workflow successfully updated")
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error(error);
                toast.error("Failed to update workflow");
            });
    };

    return (
        <Security>
            <div style={{ padding: '16px 24px', position: 'relative', zIndex: 1, height: '100%' }} role="main">
                <Title level={3} style={{ marginBottom: 16 }}>
                    Update Workflow
                </Title>

                {loading ? (
                    <Spin size="large" aria-label="Loading workflow creator" />
                ) : (
                    <>
                        <Row justify="center" style={{ marginBottom: 24 }}>
                            <Col xs={24} sm={24} md={20} lg={16}>
                                <Card size="small">
                                    <Form layout="vertical" style={{ width: '100%' }}>
                                        <Form.Item
                                            required
                                            validateStatus={!workflowName && workflowNameTouched ? "error" : ""}
                                            help={!workflowName && workflowNameTouched ? "Workflow name is required" : ""}
                                            label="Enter workflow name"
                                        >
                                            <Input
                                                placeholder="e.g., Daily Notification Setup"
                                                value={workflowName}
                                                onChange={(e) => setWorkflowName(e.target.value)}
                                                onBlur={() => setWorkflowNameTouched(true)}
                                                aria-required="true"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Enter workflow description"
                                        >
                                            <Input
                                                placeholder="e.g., Send me a notification when someone posts in my group"
                                                value={workflowDescription}
                                                onChange={(e) => setWorkflowDescription(e.target.value)}
                                            />
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={8} lg={6}>
                                <Card title="Available Actions" style={{ height: '100%' }} role="region" aria-label="Available Actions">
                                    <Space style={{ marginBottom: 16 }}>
                                        <Button onClick={workflowUtils.handleFoldAllActions} disabled={activeActionKeys.length === 0}>
                                            Fold All
                                        </Button>
                                        <Button onClick={workflowUtils.handleUnfoldAllActions}
                                                disabled={activeActionKeys.length === about?.server.services.length}>
                                            Unfold All
                                        </Button>
                                    </Space>
                                    <Collapse activeKey={activeActionKeys} onChange={setActiveActionKeys}>
                                        {about?.server?.services.map((service: Service) => (
                                            <Collapse.Panel header={service.name} key={service.name}>
                                                <List
                                                    size="small"
                                                    dataSource={service.actions}
                                                    renderItem={(action: Action) => (
                                                        <List.Item
                                                            onClick={() => workflowUtils.toggleAction(action)}
                                                            style={{
                                                                cursor: 'pointer',
                                                                backgroundColor: selectedActions.some(a => a.name === action.name)
                                                                    ? '#e6f7ff'
                                                                    : 'transparent'
                                                            }}
                                                        >
                                                            <List.Item.Meta
                                                                title={normalizeName(action.name)}
                                                                description={
                                                                    <>
                                                                        <Text type="secondary">{service.name}</Text>
                                                                        <br/>
                                                                        <Text>{action.description}</Text>
                                                                    </>
                                                                }
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                            </Collapse.Panel>
                                        ))}
                                    </Collapse>
                                </Card>
                            </Col>

                            <Col xs={24} md={8} lg={12}>
                                <Card style={{ height: '100%' }} role="region" aria-label="Selected Items">
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px',
                                        alignItems: 'center'
                                    }}>
                                        {selectedActions.length > 0 && (
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <Text strong>When:</Text>
                                                <Space wrap>
                                                    {selectedActions.map(action => (
                                                        <Card
                                                            key={action.id}
                                                            size="small"
                                                            style={{ width: '100%', maxWidth: 400 }}
                                                            extra={
                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedActions(prev => prev.filter(a => a.id !== action.id));
                                                                    }}
                                                                >
                                                                    ×
                                                                </Button>
                                                            }
                                                        >
                                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                                {normalizeName(action.name)}
                                                                {action.parameters && Object.entries(action.parameters).map(([key, value]) => {
                                                                    const paramDef = about?.server.services
                                                                        .flatMap((s: any) => s.actions)
                                                                        .find((a: any) => a.name === action.name)
                                                                        ?.parameters
                                                                        .find((p: any) => p.name === key);

                                                                    return (
                                                                        <Form.Item
                                                                            key={key}
                                                                            label={paramDef?.description || key}
                                                                            style={{ marginBottom: 8 }}
                                                                        >
                                                                            {paramDef?.type === 'number' ? (
                                                                                <Input
                                                                                    type="number"
                                                                                    value={value as unknown as string}
                                                                                    onChange={(e) => {
                                                                                        setSelectedActions(prev => prev.map(a =>
                                                                                            a.id === action.id
                                                                                                ? {...a, parameters: {...a.parameters, [key]: e.target.value}}
                                                                                                : a
                                                                                        ));
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <Input
                                                                                    value={value as unknown as string}
                                                                                    onChange={(e) => {
                                                                                        setSelectedActions(prev => prev.map(a =>
                                                                                            a.id === action.id
                                                                                                ? {...a, parameters: {...a.parameters, [key]: e.target.value}}
                                                                                                : a
                                                                                        ));
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </Form.Item>
                                                                    );
                                                                })}
                                                            </Space>
                                                        </Card>
                                                    ))}
                                                </Space>
                                            </Space>
                                        )}

                                        {selectedReactions.length > 0 && (
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <Text strong>Then:</Text>
                                                <Space wrap>
                                                    {selectedReactions.map(reaction => (
                                                        <Card
                                                            key={reaction.id}
                                                            size="small"
                                                            style={{ width: '100%', maxWidth: 400 }}
                                                            extra={
                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedReactions(prev => prev.filter(r => r.id !== reaction.id));
                                                                    }}
                                                                >
                                                                    ×
                                                                </Button>
                                                            }
                                                        >
                                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                                {normalizeName(reaction.name)}
                                                                {reaction.parameters && Object.entries(reaction.parameters).map(([key, value]) => {
                                                                    const paramDef = about?.server.services
                                                                        .flatMap((s: any) => s.reactions)
                                                                        .find((r: any) => r.name === reaction.name)
                                                                        ?.parameters
                                                                        .find((p: any) => p.name === key);

                                                                    return (
                                                                        <Form.Item
                                                                            key={key}
                                                                            label={paramDef?.description || key}
                                                                            style={{ marginBottom: 8 }}
                                                                        >
                                                                            {paramDef?.type === 'number' ? (
                                                                                <Input
                                                                                    type="number"
                                                                                    value={value as unknown as string}
                                                                                    onChange={(e) => {
                                                                                        setSelectedReactions(prev => prev.map(r =>
                                                                                            r.id === reaction.id
                                                                                                ? {...r, parameters: {...r.parameters, [key]: e.target.value}}
                                                                                                : r
                                                                                        ));
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <Input
                                                                                    value={value as unknown as string}
                                                                                    onChange={(e) => {
                                                                                        setSelectedReactions(prev => prev.map(r =>
                                                                                            r.id === reaction.id
                                                                                                ? {...r, parameters: {...r.parameters, [key]: e.target.value}}
                                                                                                : r
                                                                                        ));
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </Form.Item>
                                                                    );
                                                                })}
                                                            </Space>
                                                        </Card>
                                                    ))}
                                                </Space>
                                            </Space>
                                        )}
                                        <Space direction="horizontal"
                                               style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                                            <Button
                                                type="default"
                                                onClick={() => {
                                                    setSelectedActions([]);
                                                }}
                                                disabled={selectedActions.length === 0}
                                            >
                                                Clear Actions
                                            </Button>
                                            <Button
                                                type="default"
                                                onClick={() => {
                                                    setSelectedReactions([]);
                                                }}
                                                disabled={selectedReactions.length === 0}
                                            >
                                                Clear Reactions
                                            </Button>
                                        </Space>
                                        <Button
                                            type="primary"
                                            onClick={handleUpdateWorkflow}
                                            disabled={
                                                !workflowName
                                                || selectedActions.length < 1
                                                || selectedReactions.length < 1
                                                || !workflowUtils.areAllParametersFilled(selectedActions, selectedReactions)
                                            }
                                        >
                                            Update Workflow
                                        </Button>
                                        <LinkButton text="Cancel" goBack type="danger"/>
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={24} md={8} lg={6}>
                                <Card title="Available Reactions" style={{ height: '100%' }} role="region" aria-label="Available Reactions">
                                    <Space style={{ marginBottom: 16 }}>
                                        <Button onClick={workflowUtils.handleFoldAllReactions}
                                                disabled={activeReactionKeys.length === 0}>Fold All</Button>
                                        <Button onClick={workflowUtils.handleUnfoldAllReactions}
                                                disabled={activeReactionKeys.length === about?.server.services.length}>Unfold All</Button>
                                    </Space>
                                    <Collapse activeKey={activeReactionKeys} onChange={setActiveReactionKeys}>
                                        {about?.server?.services.map((service: Service) => (
                                            <Panel header={service.name} key={service.name}>
                                                <List
                                                    size="small"
                                                    dataSource={service.reactions}
                                                    renderItem={(reaction: Reaction) => (
                                                        <List.Item
                                                            onClick={() => workflowUtils.toggleReaction(reaction)}
                                                            style={{
                                                                cursor: 'pointer',
                                                                backgroundColor: selectedReactions.some(r => r.name === reaction.name)
                                                                    ? '#e6f7ff'
                                                                    : 'transparent'
                                                            }}
                                                        >
                                                            <List.Item.Meta
                                                                title={normalizeName(reaction.name)}
                                                                description={
                                                                    <>
                                                                        <Text type="secondary">{service.name}</Text>
                                                                        <br/>
                                                                        <Text>{reaction.description}</Text>
                                                                    </>
                                                                }
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                            </Panel>
                                        ))}
                                    </Collapse>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        </Security>
    );
};

export default UpdateWorkflow;
