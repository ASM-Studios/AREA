import React from "react";
import { Spin, Space, Card, Result } from "antd";
import Security from "@/Components/Security";
import LinkButton from "@/Components/LinkButton";
import { useUser } from "@/Context/ContextHooks";

const UpdateWorkflow: React.FC = () => {
    const [loading, _] = React.useState<boolean>(true);

    const { user, translations } = useUser();
    const userHasNoServices = user?.services === null

    return (
        <Security>
            <div style={{ padding: '16px 24px', position: 'relative', zIndex: 1, height: '100%' }} role="main">
                {userHasNoServices ? (
                    <Card>
                        <Result
                            status="error"
                            title={translations?.workflow.update.errors.noServices.title}
                            subTitle={translations?.workflow.update.errors.noServices.subtitle}
                            extra={
                                <Space>
                                    <LinkButton text={translations?.workflow.update.errors.noServices.goBack} goBack type="default" />
                                    <LinkButton text={translations?.workflow.update.errors.noServices.connectService} url="/account/me" type="primary" />
                                </Space>
                            }
                        />
                    </Card>
                ) : (
                    <>
                        {loading ? (
                            <Spin size="large" aria-label={translations?.workflow.update.loading} />
                        ) : null}
                    </>
                )}
            </div>
        </Security>
    );
};

export default UpdateWorkflow;
