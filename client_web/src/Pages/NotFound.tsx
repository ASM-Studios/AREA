import { Result } from 'antd';
// @ts-ignore
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
        />
    );
};

export default NotFound;
