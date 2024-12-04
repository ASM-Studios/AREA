import React, { useState } from "react";
import { Button, Row, Typography, Spin, Space, Card, List, Form, Input, Col, Collapse } from "antd";
import Security from "@/Components/Security";
import LinkButton from "@/Components/LinkButton";
import { normalizeName } from "@/Pages/Workflows/CreateWorkflow.utils";

// Import types correctly
import { About, Service, Action, Reaction, Workflow, Parameter } from "@/types";
import {toast} from "react-toastify";
import {instanceWithAuth} from "@/Config/backend.routes";
import {workflow as workflowRoute} from "@/Config/backend.routes";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface SelectedAction extends Action {
    id: string;
}

interface SelectedReaction extends Reaction {
    id: string;
}

const _data: About = { // Fixtures
    client: {
        host: "10.101.53.35"
    },
    server: {
        current_time: 1531680780,
        services: [
            {
                name: "facebook",
                actions: [
                    {
                        name: "new_message_in_group_w/o",
                        description: "A new message is posted in the group",
                        parameters: []
                    },
                    {
                        name: "new_message_inbox",
                        description: "A new private message is received by the user",
                        parameters: [
                            { name: "message_id", description: "ID of the message", type: "number" }
                        ]
                    },
                    {
                        name: "new_like_w/o",
                        description: "The user gains a like from one of their messages",
                        parameters: []
                    }
                ],
                reactions: [
                    {
                        name: "like_message",
                        description: "The user likes a message",
                        parameters: [
                            { name: "message_id", description: "ID of the message to like", type: "string" }
                        ]
                    }
                ]
            },
            {
                name: "twitter",
                actions: [
                    {
                        name: "new_tweet",
                        description: "A new tweet is posted",
                        parameters: [
                            { name: "tweet_id", description: "ID of the tweet", type: "string" }
                        ]
                    },
                    {
                        name: "new_follower_w/o",
                        description: "The user gains a new follower",
                        parameters: []
                    }
                ],
                reactions: [
                    {
                        name: "retweet",
                        description: "The user retweets a tweet",
                        parameters: [
                            { name: "tweet_id", description: "ID of the tweet to retweet", type: "string" }
                        ]
                    },
                    {
                        name: "like_tweet_w/o",
                        description: "The user likes a tweet",
                        parameters: []
                    }
                ]
            },
            {
                name: "github",
                actions: [
                    {
                        name: "new_issue",
                        description: "A new issue is created in a repository",
                        parameters: [
                            { name: "issue_id", description: "ID of the issue", type: "string" }
                        ]
                    },
                    {
                        name: "new_pull_request_w/o",
                        description: "A new pull request is created in a repository",
                        parameters: []
                    }
                ],
                reactions: [
                    {
                        name: "create_issue",
                        description: "The user creates a new issue",
                        parameters: [
                            { name: "repository", description: "Name of the repository", type: "string" },
                            { name: "title", description: "Title of the issue", type: "string" }
                        ]
                    },
                    {
                        name: "merge_pull_request_w/o",
                        description: "The user merges a pull request",
                        parameters: []
                    }
                ]
            },
            {
                name: "slack",
                actions: [
                    {
                        name: "new_message",
                        description: "A new message is posted in a channel",
                        parameters: [
                            { name: "channel_id", description: "ID of the channel", type: "string" },
                            { name: "message_text", description: "Text of the message", type: "string" }
                        ]
                    },
                    {
                        name: "new_reaction_w/o",
                        description: "A new reaction is added to a message",
                        parameters: []
                    }
                ],
                reactions: [
                    {
                        name: "send_message",
                        description: "The user sends a message to a channel",
                        parameters: [
                            { name: "channel_id", description: "ID of the channel", type: "string" },
                            { name: "message_text", description: "Text of the message", type: "string" }
                        ]
                    },
                    {
                        name: "add_reaction_w/o",
                        description: "The user adds a reaction to a message",
                        parameters: []
                    }
                ]
            }
        ]
    }
};

const CreateWorkflow: React.FC = () => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [about, setAbout] = React.useState<About | null>(null);
    const [selectedActions, setSelectedActions] = React.useState<SelectedAction[]>([]);
    const [selectedReactions, setSelectedReactions] = React.useState<SelectedReaction[]>([]);
    const [workflowName, setWorkflowName] = React.useState<string>('');
    const [workflowDescription, setWorkflowDescription] = React.useState<string>('');
    const [workflowNameTouched, setWorkflowNameTouched] = React.useState<boolean>(false);
    const [activeActionKeys, setActiveActionKeys] = useState<string[]>([]);
    const [activeReactionKeys, setActiveReactionKeys] = useState<string[]>([]);

    React.useEffect(() => {
        setLoading(true);
        setAbout(_data); // TODO: Fetch workflow from the server
        setLoading(false);
    }, []);

    const toggleAction = (action: Action) => {

        if (selectedActions.length > 0) {
            return toast.error("Only one action is allowed for now");
        }

        const parameters = action.parameters?.length 
            ? action.parameters.reduce((acc: Record<string, string>, param: Parameter) => ({...acc, [param.name]: ''}), {})
            : undefined;

        // @ts-ignore
        setSelectedActions(prev => [
            ...prev,
            { 
                id: `${action.name}-${Date.now()}`, 
                name: action.name,
                description: action.description,
                parameters
            }
        ]);
    };

    const toggleReaction = (reaction: Reaction) => {

        if (selectedReactions.length > 0) {
            return toast.error("Only one reaction is allowed for now");
        }

        const parameters = reaction.parameters?.length 
            ? reaction.parameters.reduce((acc: Record<string, string>, param: Parameter) => ({...acc, [param.name]: ''}), {})
            : undefined;

        // @ts-ignore
        setSelectedReactions(prev => [
            ...prev,
            { 
                id: `${reaction.name}-${Date.now()}`, 
                name: reaction.name,
                description: reaction.description,
                parameters
            }
        ]);
    };

    const areAllParametersFilled = () => {
        const actionsComplete = selectedActions.every(action => {
            if (!action.parameters) return true;
            // @ts-ignore
            return Object.values(action.parameters).every(value => value !== '');
        });

        const reactionsComplete = selectedReactions.every(reaction => {
            if (!reaction.parameters) return true;
            // @ts-ignore
            return Object.values(reaction.parameters).every(value => value !== '');
        });

        return actionsComplete && reactionsComplete;
    };

    const handleCreateWorkflow = () => {
        const workflow: Workflow = {
            name: workflowName,
            description: workflowDescription,
            service: about?.server.services.find(service =>
                service.actions.some(action => action.name === selectedActions[0]?.name)
            )?.name ?? "unknown",
            events:
            [
                ...selectedActions.map(action => {
                    const actionDef = about?.server.services
                    .flatMap((s: Service) => s.actions)
                    .find((a: Action) => a.name === action.name);

                    return {
                        name: action.name,
                        type: 'action' as "action",
                        description: action.description,
                        parameters: Object.entries(action.parameters || {}).map(([name, value]) => {
                            const paramDef = actionDef?.parameters.find((p: Parameter) => p.name === name);
                            return {
                                name,
                                type: paramDef?.type || 'string',
                                value
                            };
                        })
                    }
                }),
                ...selectedReactions.map(reaction => {
                    const reactionDef = about?.server.services
                        .flatMap((s: Service) => s.reactions)
                        .find((r: Reaction) => r.name === reaction.name);

                    return {
                        name: reaction.name,
                        type: 'reaction' as "reaction",
                        description: reaction.description,
                        parameters: Object.entries(reaction.parameters || {}).map(([name, value]) => {
                            const paramDef = reactionDef?.parameters.find((p: Parameter) => p.name === name);
                            return {
                                name,
                                type: paramDef?.type || 'string',
                                value
                            };
                        })
                    };
                })
            ]
        }
        instanceWithAuth.post(workflowRoute.create, workflow)
            .then(() => {
                toast.success("Workflow successfully published")
                //TODO: Go to /workflow/{id}
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleFoldAllActions = () => {
        setActiveActionKeys([]);
    };

    const handleUnfoldAllActions = () => {
        if (about) {
            setActiveActionKeys(about.server.services.map((service: Service) => service.name));
        }
    };

    const handleFoldAllReactions = () => {
        setActiveReactionKeys([]);
    };

    const handleUnfoldAllReactions = () => {
        if (about) {
            setActiveReactionKeys(about.server.services.map((service: Service) => service.name));
        }
    };

    return (
        <Security>
            <div style={{ padding: '16px 24px', position: 'relative', zIndex: 1 }} role="main">
                <Title level={3} style={{ marginBottom: 16 }}>
                    Create Workflow
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

                        <Row gutter={[24, 24]} style={{ minHeight: '400px', height: 'calc(100vh - 250px)' }}>
                            <Col xs={24} md={8} lg={6}>
                                <Card title="Available Actions" style={{ height: '100%', overflow: 'auto' }} role="region" aria-label="Available Actions">
                                    <Space style={{ marginBottom: 16 }}>
                                        <Button onClick={handleFoldAllActions} disabled={activeActionKeys.length === 0}>Fold
                                            All</Button>
                                        <Button onClick={handleUnfoldAllActions}
                                                disabled={activeActionKeys.length === about?.server.services.length}>Unfold
                                            All</Button>
                                    </Space>
                                    <Collapse activeKey={activeActionKeys} onChange={setActiveActionKeys}>
                                        {about?.server?.services.map((service: Service) => (
                                            <Collapse.Panel header={service.name} key={service.name}>
                                                <List
                                                    size="small"
                                                    dataSource={service.actions}
                                                    renderItem={(action: Action) => (
                                                        <List.Item
                                                            onClick={() => toggleAction(action)}
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
                                <Card style={{ height: '100%', overflow: 'auto' }} role="region" aria-label="Selected Items">
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
                                            onClick={handleCreateWorkflow}
                                            disabled={
                                                !workflowName
                                                || selectedActions.length < 1
                                                || selectedReactions.length < 1
                                                || !areAllParametersFilled()
                                            }
                                        >
                                            Create Workflow
                                        </Button>
                                        <LinkButton text="Cancel" goBack type="danger"/>
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={24} md={8} lg={6}>
                                <Card title="Available Reactions" style={{ height: '100%', overflow: 'auto' }} role="region" aria-label="Available Reactions">
                                    <Space style={{ marginBottom: 16 }}>
                                        <Button onClick={handleFoldAllReactions}
                                                disabled={activeReactionKeys.length === 0}>Fold All</Button>
                                        <Button onClick={handleUnfoldAllReactions}
                                                disabled={activeReactionKeys.length === about?.server.services.length}>Unfold
                                            All</Button>
                                    </Space>
                                    <Collapse activeKey={activeReactionKeys} onChange={setActiveReactionKeys}>
                                        {about?.server?.services.map((service: Service) => (
                                            <Panel header={service.name} key={service.name}>
                                                <List
                                                    size="small"
                                                    dataSource={service.reactions}
                                                    renderItem={(reaction: Reaction) => (
                                                        <List.Item
                                                            onClick={() => toggleReaction(reaction)}
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

export default CreateWorkflow;
