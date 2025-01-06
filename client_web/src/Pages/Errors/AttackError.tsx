import { Result } from 'antd';
import LinkButton from "@/Components/LinkButton";
import React from 'react';
import { useUser } from "@/Context/ContextHooks";

const AttackError: React.FC = () => {
    const { translations } = useUser();

    return (
        <Result
            status="error"
            title={translations?.errors?.attack?.title}
            subTitle={translations?.errors?.attack?.subtitle}
            extra={
                <LinkButton text={translations?.errors?.attack?.backHome} url="/" />
            }
            style={{ zIndex: 1, position: 'relative' }}
        />
    );
};

export default AttackError;
