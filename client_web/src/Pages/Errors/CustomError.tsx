import { Result } from 'antd';
import LinkButton from "@/Components/LinkButton";
import React from 'react';
import {ErrorContext} from "@/Context/Scopes/ErrorContext";
import { useError } from "@/Context/ContextHooks";
import { useAuth } from "@/Context/ContextHooks";

const CustomError: () => React.ReactElement = () => {
    const { error } = useError();
    const { isAuthenticated } = useAuth();

    return (
        <Result
            status="error"
            title={`${error?.error ?? 'Error'}`}
            subTitle={`${error?.errorDescription ?? 'An error occurred'}`}
            extra={
                <LinkButton
                    text={isAuthenticated ? "Back to Dashboard" : "Back Home"}
                    url={isAuthenticated ? "/dashboard" : "/"}
                />
            }
            style={{ zIndex: 1, position: 'relative' }}
        />
    );
};

export default CustomError;
