import { Result } from 'antd';
import LinkButton from "@/Components/LinkButton";
import React from 'react';
import { useUser } from "@/Context/ContextHooks";

const ApiNotConnected: React.FC = () => {
    const { translations } = useUser();

    return (
        <Result
            status="error"
            title={translations?.errors?.api?.title}
            subTitle={translations?.errors?.api?.subtitle}
            extra={
                <LinkButton text="Back Home" url="/" />
            }
            style={{ zIndex: 1, position: 'relative' }}
        />
    );
};

export default ApiNotConnected;
