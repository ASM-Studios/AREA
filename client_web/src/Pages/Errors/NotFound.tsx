import { Result } from 'antd';
import LinkButton from "@/Components/LinkButton";
import React from 'react';

const NotFound: React.FC = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <LinkButton text="Back Home" url="/" />
            }
            style={{ zIndex: 1, position: 'relative' }}
        />
    );
};

export default NotFound;
