import { Result } from 'antd';
import LinkButton from "@/Components/LinkButton";
import React from 'react';

const ApiNotConnected: React.FC = () => {
    return (
        <Result
            status="error"
            title="API Not Connected"
            subTitle="Sorry, the API is currently not available."
            extra={
                <LinkButton text="Back Home" url="/" />
            }
            style={{ zIndex: 1, position: 'relative' }}
        />
    );
};

export default ApiNotConnected;
