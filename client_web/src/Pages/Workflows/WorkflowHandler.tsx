import React from 'react';
import { useNavigate } from "react-router-dom";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card, Layout, Typography, Space, Spin, Result, Input, Form, Steps, Row, Col, Collapse, Button, DatePicker } from 'antd';
import { toast } from 'react-toastify';
import { About, Action, filteredEvents, Reaction, Parameter, Workflow } from '@/types';
import { instanceWithAuth, root, workflow as workflowRoute } from "@Config/backend.routes";
import Security from "@/Components/Security";
import { useError, useUser } from "@/Context/ContextHooks";
import LinkButton from "@/Components/LinkButton";
import { setDefaultData, isWorkflowValid } from './WorkflowHandler.utils';

const { Text } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

const WorkflowHandler: React.FC = () => {
  /* Input data */
  const [about, setAbout] = React.useState<About | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [filteredActions, setFilteredActions] = React.useState<filteredEvents[]>([]);
  const [filteredReactions, setFilteredReactions] = React.useState<filteredEvents[]>([]);
  
  /* Workflow data */
  const [formData, setFormData] = React.useState<{ name: string, description: string}>({ name: "", description: "" });
  const [currentStep, setCurrentStep] = React.useState(0);
  const [workflowActions, setWorkflowActions] = React.useState<Array<{action: Action, parameters: Record<string, string>}>>([]);
  const [workflowReactions, setWorkflowReactions] = React.useState<Array<{reaction: Reaction, parameters: Record<string, string>}>>([]);

  const navigate = useNavigate();
  const { setError } = useError();
  const { user, translations } = useUser();
  const userHasNoServices = !user?.services || user.services.length === 0;

  const MAX_ACTION = 1; // TODO: Remove when limitless events are implemented
  const MAX_REACTION = 1;

  // Memoize the validation check since it depends on multiple states
  const isWorkflowValidMemo = React.useMemo(() => 
    isWorkflowValid(formData, workflowActions, workflowReactions),
    [formData, workflowActions, workflowReactions]
  );

  // Memoize the parameter rendering function since it's a complex function
  const memoizedRenderParameterInput = React.useMemo(() => 
    (parameter: Parameter, value: string, onChange: (value: string) => void) => {
      switch (parameter.type) {
        case 'datetime':
          return <DatePicker onChange={(date) => onChange(date?.toISOString() || '')} />;
        case 'number':
          return <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} />;
        default:
          return <Input value={value} onChange={(e) => onChange(e.target.value)} />;
      }
    },
    []
  );

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
      })
      .catch((error) => {
        console.error(error);
        setError({ error: "API Error", errorDescription: "Could not fetch server information" });
        navigate('/error/fetch');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddAction = (action: Action) => {
    if (workflowActions.length >= MAX_ACTION) {
      toast.error(`You can only add up to ${MAX_ACTION} actions`);
      return;
    }
    setWorkflowActions([...workflowActions, { action, parameters: {} }]);
  };

  const handleAddReaction = (reaction: Reaction) => {
    if (workflowReactions.length >= MAX_REACTION) {
      toast.error(`You can only add up to ${MAX_REACTION} reactions`);
      return;
    }
    setWorkflowReactions([...workflowReactions, { reaction, parameters: {} }]);
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
                    type: item.action.parameters.find(p => p.name === name)?.type || 'string',
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
                    type: item.reaction.parameters.find(p => p.name === name)?.type || 'string',
                    value
                }))
            }))
        ]
    };

    instanceWithAuth.post(workflowRoute.create, workflow)
        .then(() => {
            toast.success(translations?.workflow.create.success.published);
            navigate('/dashboard');
        })
        .catch((error) => {
            console.error(error);
            toast.error(translations?.workflow.create.errors.apiError?.subtitle);
        });
  };

  const renderNoServicesResult = () => (
    <Card>
      <Result
        status="error"
        title={translations?.workflow.create.errors.noServices.title}
        subTitle={translations?.workflow.create.errors.noServices.subtitle}
        extra={
          <Space>
            <LinkButton 
              text={translations?.workflow.create.errors.noServices.goBack} 
              goBack 
              type="default" 
            />
            <LinkButton 
              text={translations?.workflow.create.errors.noServices.connectService} 
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
        <Card className="workflow-card" style={{ borderRadius: '12px', marginBottom: '24px' }}>
          <Steps current={currentStep} onChange={setCurrentStep} style={{ marginBottom: '32px' }}>
            <Step title={translations?.workflow.create.form.name.label} description={translations?.workflow.create.form.description.label} />
            <Step title={translations?.workflow.create.sections.when} description={translations?.workflow.create.sections.availableActions} />
            <Step title={translations?.workflow.create.sections.then} description={translations?.workflow.create.sections.availableReactions} />
          </Steps>

          <div style={{ marginBottom: '24px' }}>
            {currentStep === 0 && (
              <div className="step-content">
                <Form.Item 
                  label={translations?.workflow.create.form.name.label} 
                  required
                >
                  <Input
                    placeholder={translations?.workflow.create.form.name.placeholder}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </Form.Item>
                <Form.Item label={translations?.workflow.create.form.description.label}>
                  <Input.TextArea
                    placeholder={translations?.workflow.create.form.description.placeholder}
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
                    <Card title={translations?.workflow.create.sections.availableActions} className="events-card" style={{ borderRadius: '8px' }}>
                      <Collapse>
                        {filteredActions.map((service) => (
                          <Panel header={service.service} key={service.service}>
                            {service.events.map((action: Action) => (
                              <Card
                                key={action.id}
                                size="small"
                                className="event-item"
                                extra={<Button type="link" onClick={() => handleAddAction(action)}><PlusOutlined /></Button>}
                                style={{ 
                                  borderRadius: '8px',
                                  marginBottom: '12px',
                                  backgroundColor: '#f8f9fa'
                                }}
                              >
                                <Text strong>{action.name}</Text>
                                <Text type="secondary" style={{display: 'block'}}>{action.description}</Text>
                              </Card>
                            ))}
                          </Panel>
                        ))}
                      </Collapse>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title={translations?.workflow.create.sections.selectedItems} className="selected-events-card" style={{ borderRadius: '8px' }}>
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
                            <Button type="link" danger onClick={() => handleRemoveAction(index)}>
                              <DeleteOutlined />
                            </Button>
                          }
                        >
                          <Text strong>{item.action.name}</Text>
                          {item.action.parameters.map((param) => (
                            <Form.Item key={param.name} label={param.name}>
                              {memoizedRenderParameterInput(
                                param,
                                item.parameters[param.name] || '',
                                (value) => handleParameterChange(index, param.name, value, true)
                              )}
                            </Form.Item>
                          ))}
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
                    <Card title={translations?.workflow.create.sections.availableReactions} className="events-card" style={{ borderRadius: '8px' }}>
                      <Collapse>
                        {filteredReactions.map((service) => (
                          <Panel header={service.service} key={service.service}>
                            {service.events.map((reaction: Reaction) => (
                              <Card
                                key={reaction.id}
                                size="small"
                                className="event-item"
                                extra={<Button type="link" onClick={() => handleAddReaction(reaction)}><PlusOutlined /></Button>}
                                style={{ 
                                  borderRadius: '8px',
                                  marginBottom: '12px',
                                  backgroundColor: '#f8f9fa'
                                }}
                              >
                                <Text strong>{reaction.name}</Text>
                                <Text type="secondary" style={{display: 'block'}}>{reaction.description}</Text>
                              </Card>
                            ))}
                          </Panel>
                        ))}
                      </Collapse>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title={translations?.workflow.create.sections.selectedItems} className="selected-events-card" style={{ borderRadius: '8px' }}>
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
                            <Button type="link" danger onClick={() => handleRemoveReaction(index)}>
                              <DeleteOutlined />
                            </Button>
                          }
                        >
                          <Text strong>{item.reaction.name}</Text>
                          {item.reaction.parameters.map((param) => (
                            <Form.Item key={param.name} label={param.name}>
                              {memoizedRenderParameterInput(
                                param,
                                item.parameters[param.name] || '',
                                (value) => handleParameterChange(index, param.name, value, false)
                              )}
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

          <div className="steps-action" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {currentStep > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => setCurrentStep(currentStep - 1)}>
                  {translations?.common.table.cancel}
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
                  {translations?.workflow.create.buttons.create}
                </Button>
              )}
            </div>
            <LinkButton text={translations?.workflow.create.buttons.cancel} goBack type="danger" />
          </div>
        </Card>
      </Form>
    </Layout>
  );

  return (
    <Security>
      <div style={{ padding: '16px 24px', position: 'relative', zIndex: 1, height: '100%' }} role="main">
        {userHasNoServices ? (
          renderNoServicesResult()
        ) : (
          <>
            {loading || !about ? (
              <Spin size="large" tip={translations?.workflow.create.loading} />
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
