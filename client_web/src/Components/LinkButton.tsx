import React from "react";
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

interface LinkButtonProps {
    text: string;
    url?: string;
    style?: React.CSSProperties;
    type?: "primary" | "default" | "dashed" | "link" | "text" | "danger" | undefined;
    goBack?: boolean;
    disabled?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({ text, url, type = "primary", style = {}, goBack = false, disabled = false }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (goBack) {
            navigate(-1);
        } else if (url) {
            navigate(url);
        }
    };

    const buttonStyle = type === "danger" ? { ...style, backgroundColor: 'red', borderColor: 'red', color: 'white' } : style;

    return (
        <Button
            type={
                type === "danger"
                    ? "default"
                    : type
            }
            style={buttonStyle}
            onClick={handleClick}
            disabled={disabled}
            aria-label={text}
        >
            {text}
        </Button>
    );
};

export default LinkButton;
