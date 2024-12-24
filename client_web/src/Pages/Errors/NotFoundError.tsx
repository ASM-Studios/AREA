import { Result } from 'antd';
import LinkButton from "@/Components/LinkButton";
import React from 'react';
import { useUser } from "@/Context/ContextHooks";

const NotFoundError: React.FC = () => {
    const { translations } = useUser();

    return (
        <Result
            status="404"
            title={translations?.errors?.notFound?.title}
            subTitle={translations?.errors?.notFound?.subtitle}
            extra={
                <LinkButton text={translations?.errors?.notFound?.backHome} url="/" />
            }
            style={{ zIndex: 1, position: 'relative' }}
        />
    );
};

export default NotFoundError;
