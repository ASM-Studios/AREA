import React from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
    AutoComplete,
    Button,
    Card,
    Col,
    Collapse,
    DatePicker,
    Form,
    Input,
    Layout,
    List,
    Result,
    Row,
    Space,
    Spin,
    Steps,
    Typography
} from 'antd';
import { toast } from 'react-toastify';
import { About, Action, filteredEvents, GetWorkflow, Reaction, Secret, Workflow } from '@/types';
import { instanceWithAuth, root, workflow as workflowRoute, secret as secretRoute } from "@Config/backend.routes";
import Security from "@/Components/Security";
import { useError, useUser} from "@/Context/ContextHooks";
import LinkButton from "@/Components/LinkButton";
import { isWorkflowValid, setDefaultData } from './WorkflowHandler.utils';

const { Text } = Typography;
const { Step } = Steps;

const WorkflowHandler: React.FC = () => {
    /* Input data */
    const [about, setAbout] = React.useState<About | undefined>(undefined);
    const [loading, setLoading] = React.useState(false);
    const [filteredActions, setFilteredActions] = React.useState<filteredEvents[]>([]);
    const [filteredReactions, setFilteredReactions] = React.useState<filteredEvents[]>([]);
    const [edit, setEdit] = React.useState(false);
    const [workflowId, setWorkflowId] = React.useState<number | undefined>(undefined);

    /* Workflow data */
    const [formData, setFormData] = React.useState<{ name: string, description: string }>({name: "", description: ""});
    const [currentStep, setCurrentStep] = React.useState(0);
    const [workflowActions, setWorkflowActions] = React.useState<Array<{
        action: Action,
        parameters: Record<string, string>
    }>>([]);
    const [workflowReactions, setWorkflowReactions] = React.useState<Array<{
        reaction: Reaction,
        parameters: Record<string, string>
    }>>([]);
    const [availableVariables, setAvailableVariables] = React.useState<string[]>([]);
    const [availableSecrets, setAvailableSecrets] = React.useState<string[]>([]);

    const navigate = useNavigate();
    const location = useLocation();
    const {id} = useParams();
    const {setError} = useError();
    const {user, translations} = useUser();
    const userHasNoServices = !user?.services || user.services.length === 0;

    const MAX_ACTION = 1;
    const MAX_REACTION = 10;

    const isWorkflowValidMemo = React.useMemo(() =>
            isWorkflowValid(availableVariables, formData, workflowActions, workflowReactions),
        [availableVariables, formData, workflowActions, workflowReactions]);

    React.useEffect(() => {
        setLoading(true);
        instanceWithAuth.get(root.about)
            .then((response) => {
                setAbout(response?.data);
                setDefaultData(
                    response?.data,
                    user,
                    userHasNoServices,
                    setError,
                    navigate,
                    setFilteredActions,
                    setFilteredReactions
                );

                instanceWithAuth.get(secretRoute.list)
                    .then((response) => {
                        const secrets: Secret[] = response?.data?.secrets;
                        setAvailableSecrets(secrets?.map(secret => `$${secret.key}`) || []);
                        const availableVariables = secrets?.map(secret => `$${secret.key}`) || [];
                        setAvailableVariables(availableVariables);
                    })
                    .catch((error) => {
                        console.error(error);
                        setError({error: "API Error", errorDescription: "Could not fetch server information"});
                        navigate('/error/fetch');
                    });
            })
            .catch((error) => {
                console.error(error);
                setError({error: "API Error", errorDescription: "Could not fetch server information"});
                navigate('/error/fetch');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    React.useEffect(() => {
        if (location.pathname.includes('/workflow/update')) {
            setEdit(true);
            setWorkflowId(parseInt(id ?? '0') ?? undefined);
        } else {
            setEdit(false);
            setWorkflowId(undefined);
        }
    }, [location, id]);

    React.useEffect(() => {
        if (!edit || !workflowId || !about) {
            return;
        }

        instanceWithAuth.get(workflowRoute.get + `/${workflowId}`)
            .then((response) => {
                const workflowData: GetWorkflow = response?.data?.workflow;

                setFormData({
                    name: workflowData.name,
                    description: workflowData.description
                });

                const actions = workflowData?.events?.filter(event => event.type === 'action') ?? [];
                const reactions = workflowData?.events?.filter(event => event.type === 'reaction') ?? [];

                const validActions = actions.map(event => {
                    const action = about.server.services
                        .flatMap(s => s.actions || [])
                        .find(a => a.name === event.name);

                    return action ? {
                        action,
                        parameters: event?.parameters?.reduce((acc, param) => ({
                            ...acc,
                            [param.name]: param.value
                        }), {})
                    } : null;
                }).filter((item): item is NonNullable<typeof item> => item !== null);

                const variables = validActions.flatMap((item, index) => 
                    item.action.variables?.map(variable => 
                        `$${item.action.shortname}.${variable}.${index}`
                    ) || []
                );
                setAvailableVariables(variables);

                const validReactions = reactions.map(event => {
                    const reaction = about.server.services
                        .flatMap(s => s.reactions || [])
                        .find(r => r.name === event.name);

                    return reaction ? {
                        reaction,
                        parameters: event?.parameters?.reduce((acc, param) => ({
                            ...acc,
                            [param.name]: param.value
                        }), {})
                    } : null;
                }).filter((item): item is NonNullable<typeof item> => item !== null);

                setWorkflowActions(validActions);
                setWorkflowReactions(validReactions);
            })
            .catch((error) => {
                console.error(error);
                toast.error(translations?.workflow.handler.errors.apiError.subtitle + workflowId);
                setEdit(false);
                navigate('/dashboard');
            });
    }, [edit, workflowId, about]);

    const handleAddAction = (action: Action) => {
        if (workflowActions.length >= MAX_ACTION) {
            toast.error(`You can only add up to ${MAX_ACTION} actions, please upgrade your plan`);
            return;
        }

        const newVariables = action?.variables?.map(variable => `$${action.shortname}.${variable}.${workflowActions.length}`) || [];
        setAvailableVariables(prevVariables => {
            return [...prevVariables, ...newVariables];
        });

        setWorkflowActions([...workflowActions, {action, parameters: {}}]);
    };

    const handleAddReaction = (reaction: Reaction) => {
        if (workflowReactions.length >= MAX_REACTION) {
            toast.error(`You can only add up to ${MAX_REACTION} reactions, please upgrade your plan`);
            return;
        }
        setWorkflowReactions([...workflowReactions, {reaction, parameters: {}}]);
    };

    const handleParameterChange = (eventIndex: number, paramName: string, value: string, isAction: boolean) => {
        if (isAction) {
            const newActions = [...workflowActions];
            newActions[eventIndex].parameters[paramName] = value;
            setWorkflowActions(newActions);
        } else {
            const newReactions = [...workflowReactions];
            newReactions[eventIndex].parameters[paramName] = value;
            setWorkflowReactions(newReactions);
        }
    };

    const handleRemoveAction = (index: number) => {
        const actionToRemove = workflowActions[index];
        const variablesToRemove = actionToRemove.action.variables?.map(
            variable => `$${actionToRemove.action.shortname}.${variable}.${index}`
        ) || [];
        
        setAvailableVariables(prevVariables => 
            prevVariables.filter(variable => !variablesToRemove.includes(variable))
        );

        const newActions = workflowActions.filter((_, i) => i !== index);
        setWorkflowActions(newActions);
    };

    const handleRemoveReaction = (index: number) => {
        const newReactions = workflowReactions.filter((_, i) => i !== index);
        setWorkflowReactions(newReactions);
    };

    const handleCreateWorkflow = () => {
        const workflow: Workflow = {
            name: formData.name,
            description: formData.description,
            services: [...new Set([
                ...workflowActions.map(item => {
                    const service = about?.server.services.find(s =>
                        s.actions?.some(a => a.name === item.action.name)
                    );
                    return service?.id;
                }),
                ...workflowReactions.map(item => {
                    const service = about?.server.services.find(s =>
                        s.reactions?.some(r => r.name === item.reaction.name)
                    );
                    return service?.id;
                })
            ])].filter(id => id !== undefined) as number[],
            events: [
                ...workflowActions.map(item => ({
                    id: item.action.id,
                    name: item.action.name,
                    type: 'action' as "action",
                    description: item.action.description,
                    parameters: Object.entries(item.parameters).map(([name, value]) => ({
                        name,
                        type: item?.action?.parameters?.find(p => p.name === name)?.type || 'string',
                        value
                    }))
                })),
                ...workflowReactions.map(item => ({
                    id: item.reaction.id,
                    name: item.reaction.name,
                    type: 'reaction' as "reaction",
                    description: item.reaction.description,
                    parameters: Object.entries(item.parameters).map(([name, value]) => ({
                        name,
                        type: item?.reaction?.parameters?.find(p => p.name === name)?.type || 'string',
                        value
                    }))
                }))
            ]
        };

        const request = edit
            ? instanceWithAuth.put(workflowRoute.update + `/${workflowId}`, workflow)
            : instanceWithAuth.post(workflowRoute.create, workflow);

        request
            .then(() => {
                toast.success(translations?.workflow.handler.success.published);
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error(error);
                toast.error(translations?.workflow.handler.errors.apiError?.subtitle);
            });
    };

    const renderActionCard = (action: Action) => (
        <Card
            key={action.id}
            size="small"
            className="event-item"
            extra={<Button type="link" onClick={() => handleAddAction(action)}><PlusOutlined/></Button>}
            style={{
                borderRadius: '8px',
                marginBottom: '12px',
                backgroundColor: '#f8f9fa'
            }}
        >
            <Text strong>{action.name}</Text>
            <Text type="secondary" style={{ display: 'block' }}>{action.description}</Text>
        </Card>
    );

    const renderReactionCard = (reaction: Reaction) => (
        <Card
            key={reaction.id}
            size="small"
            className="event-item"
            extra={<Button type="link" onClick={() => handleAddReaction(reaction)}><PlusOutlined/></Button>}
            style={{
                borderRadius: '8px',
                marginBottom: '12px',
                backgroundColor: '#f8f9fa'
            }}
        >
            <Text strong>{reaction.name}</Text>
            <Text type="secondary" style={{ display: 'block' }}>{reaction.description}</Text>
        </Card>
    );

    const collapseActionItems = filteredActions.map((service) => ({
        key: service.service + '-actions',
        label: service.service,
        children: service.events.map((event) => renderActionCard(event as Action))
    }));

    const collapseReactionItems = filteredReactions.map((service) => ({
        key: service.service + '-reactions',
        label: service.service,
        children: service.events.map((event) => renderReactionCard(event as Reaction))
    }));

    const renderNoServicesResult = () => (
        <Card>
            <Result
                status="error"
                title={translations?.workflow.handler.errors.noServices.title}
                subTitle={translations?.workflow.handler.errors.noServices.subtitle}
                extra={
                    <Space>
                        <LinkButton
                            text={translations?.workflow.handler.errors.noServices.goBack}
                            goBack
                            type="default"
                        />
                        <LinkButton
                            text={translations?.workflow.handler.errors.noServices.connectService}
                            url="/account/me"
                            type="primary"
                        />
                    </Space>
                }
            />
        </Card>
    );

    const renderWorkflowContent = () => (
        <Layout className="workflow-layout">
            <Form layout="vertical" initialValues={formData}>
                <Card className="workflow-card" style={{borderRadius: '12px', marginBottom: '24px'}}>
                    <Steps current={currentStep} onChange={setCurrentStep} style={{marginBottom: '32px'}}>
                        <Step title={translations?.workflow.handler.form.name.label}
                              description={translations?.workflow.handler.form.description.label}/>
                        <Step title={translations?.workflow.handler.sections.when}
                              description={translations?.workflow.handler.sections.availableActions}/>
                        <Step title={translations?.workflow.handler.sections.then}
                              description={translations?.workflow.handler.sections.availableReactions}/>
                    </Steps>

                    <div style={{marginBottom: '24px'}}>
                        {currentStep === 0 && (
                            <div className="step-content">
                                <Form.Item
                                    label={translations?.workflow.handler.form.name.label}
                                    required
                                >
                                    <Input
                                        placeholder={translations?.workflow.handler.form.name.placeholder}
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </Form.Item>
                                <Form.Item label={translations?.workflow.handler.form.description.label}>
                                    <Input.TextArea
                                        placeholder={translations?.workflow.handler.form.description.placeholder}
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </Form.Item>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="step-content">
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Card title={translations?.workflow.handler.sections.availableActions}
                                              className="events-card" style={{borderRadius: '8px'}}>
                                            <Collapse items={collapseActionItems}/>
                                        </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card title={translations?.workflow.handler.sections.selectedItems}
                                              className="selected-events-card" style={{borderRadius: '8px'}}>
                                            {workflowActions.map((item, index) => (
                                                <Card
                                                    key={index}
                                                    size="small"
                                                    className="selected-event-item"
                                                    style={{
                                                        borderRadius: '8px',
                                                        marginBottom: '12px',
                                                        backgroundColor: '#f8f9fa'
                                                    }}
                                                    extra={
                                                        <Button type="link" danger
                                                                onClick={() => handleRemoveAction(index)}>
                                                            <DeleteOutlined/>
                                                        </Button>
                                                    }
                                                >
                                                    <Text strong>{item?.action?.name}</Text>
                                                    {item?.action?.parameters?.map((param) => (
                                                        <Form.Item key={param.name} label={param.name}>
                                                            {(() => {
                                                                switch (param.type) {
                                                                    case 'datetime':
                                                                        return <DatePicker
                                                                            onChange={(date) => handleParameterChange(index, param.name, date?.toISOString() || '', true)} allowClear/>;
                                                                    case 'number':
                                                                        return <Input type="number"
                                                                                      value={item.parameters[param.name] || ''}
                                                                                      onChange={(e) => handleParameterChange(index, param.name, e.target.value, true)}
                                                                                      allowClear
                                                                        />;
                                                                    default:
                                                                        return (
                                                                            <AutoComplete
                                                                                allowClear
                                                                                value={item.parameters[param.name] || ''}
                                                                                onChange={(value) => {
                                                                                    handleParameterChange(index, param.name, value, true);
                                                                                }}
                                                                                options={availableSecrets.map(secret => ({ value: secret }))}
                                                                                filterOption={(inputValue, option) => {
                                                                                    return option?.value.toLowerCase().includes(inputValue.toLowerCase()) ?? false;
                                                                                }}
                                                                            />
                                                                        );
                                                                }
                                                            })()}
                                                        </Form.Item>
                                                    ))}
                                                    {item?.action?.variables && (
                                                        <Collapse>
                                                            <Collapse.Panel header={translations?.workflow?.handler?.sections?.availableVariables} key="1">
                                                                <List
                                                                    size="small"
                                                                    dataSource={item.action.variables}
                                                                    renderItem={(variable: string) => (
                                                                        <List.Item>
                                                                            <Text type="secondary">{`$${item.action.shortname}.${variable}.${index}`}</Text>
                                                                        </List.Item>
                                                                    )}
                                                                />
                                                            </Collapse.Panel>
                                                        </Collapse>
                                                    )}
                                                </Card>
                                            ))}
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="step-content">
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Card title={translations?.workflow.handler.sections.availableReactions}
                                              className="events-card" style={{borderRadius: '8px'}}>
                                            <Collapse items={collapseReactionItems}/>
                                        </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card title={translations?.workflow.handler.sections.selectedItems}
                                              className="selected-events-card" style={{borderRadius: '8px'}}>
                                            {workflowReactions.map((item, index) => (
                                                <Card
                                                    key={index}
                                                    size="small"
                                                    className="selected-event-item"
                                                    style={{
                                                        borderRadius: '8px',
                                                        marginBottom: '12px',
                                                        backgroundColor: '#f8f9fa'
                                                    }}
                                                    extra={
                                                        <Button type="link" danger
                                                                onClick={() => handleRemoveReaction(index)}>
                                                            <DeleteOutlined/>
                                                        </Button>
                                                    }
                                                >
                                                    <Text strong>{item?.reaction?.name}</Text>
                                                    {item?.reaction?.parameters?.map((param) => (
                                                        <Form.Item key={param.name} label={param.name}>
                                                            {(() => {
                                                                switch (param.type) {
                                                                    case 'datetime':
                                                                        return <DatePicker
                                                                            onChange={(date) => handleParameterChange(index, param.name, date?.toISOString() || '', false)} allowClear/>;
                                                                    case 'number':
                                                                        return <Input type="number"
                                                                                      value={item.parameters[param.name] || ''}
                                                                                      onChange={(e) => handleParameterChange(index, param.name, e.target.value, false)}
                                                                                      allowClear
                                                                        />;
                                                                    default:
                                                                        return (
                                                                            <AutoComplete
                                                                                allowClear
                                                                                value={item.parameters[param.name] || ''}
                                                                                onChange={(value) => {
                                                                                    handleParameterChange(index, param.name, value, false);
                                                                                }}
                                                                                options={availableVariables.map(variable => ({ value: variable }))}
                                                                                filterOption={(inputValue, option) => {
                                                                                    return option?.value.toLowerCase().includes(inputValue.toLowerCase()) ?? false;
                                                                                }}
                                                                            />
                                                                        );
                                                                }
                                                            })()}
                                                        </Form.Item>
                                                    ))}
                                                </Card>
                                            ))}
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>

                    <div className="steps-action" style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            {currentStep > 0 && (
                                <Button style={{margin: '0 8px'}} onClick={() => setCurrentStep(currentStep - 1)}>
                                    {translations?.common.table.previous}
                                </Button>
                            )}
                            {currentStep < 2 && (
                                <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                                    {translations?.common.table.next}
                                </Button>
                            )}
                            {currentStep === 2 && (
                                <Button
                                    type="primary"
                                    onClick={handleCreateWorkflow}
                                    disabled={!isWorkflowValidMemo}
                                >
                                    {edit
                                        ? translations?.workflow.handler.buttons.update
                                        : translations?.workflow.handler.buttons.create
                                    }
                                </Button>
                            )}
                        </div>
                        <LinkButton text={translations?.workflow.handler.buttons.cancel} goBack type="danger"/>
                    </div>
                </Card>
            </Form>
        </Layout>
    );

    return (
        <Security>
            <div style={{padding: '16px 24px', position: 'relative', zIndex: 1, height: '100%'}} role="main">
                {userHasNoServices ? (
                    renderNoServicesResult()
                ) : (
                    <>
                        {loading || !about ? (
                            <Spin size="large"/>
                        ) : (
                            renderWorkflowContent()
                        )}
                    </>
                )}
            </div>
        </Security>
    );
};

export default WorkflowHandler;
