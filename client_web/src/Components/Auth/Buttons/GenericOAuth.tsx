import React from 'react';
import { Form, Button } from 'antd';

interface GenericOAuthButtonProps {
    handleLogin: () => void,
    buttonText: string,
    disabled?: boolean,
    service: string,
    iconSrc: string,
    key?: string
}

const GenericOAuthButton: React.FC<GenericOAuthButtonProps> = ({
    handleLogin,
    buttonText,
    disabled = false,
    service,
    iconSrc,
    key
}) => {
    return (
        <Form.Item style={{textAlign: 'center'}} key={key}>
            <Button
                onClick={handleLogin}
                className={"w-full flex items-center justify-center gap-2 bg-[#5865F2] text-white py-2 px-4 rounded-md hover:bg-[#4752C4] transition-colors"}
                disabled={disabled}
            >
                <img
                    src={iconSrc}
                    alt={`${service} Logo`}
                    style={{width: '24px', height: '24px'}}
                />
                {buttonText}
            </Button>
        </Form.Item>
    );
};

export default GenericOAuthButton;
