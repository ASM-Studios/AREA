import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@/Context/ContextHooks";
import { useNavigate } from "react-router-dom";
import { Spin } from 'antd';
import { instanceWithAuth, auth } from "@Config/backend.routes";
import { toast } from "react-toastify";

type SecurityProps = {
    children: React.ReactNode;
};

const Security = ({ children }: SecurityProps) => {
    const { jsonWebToken, setIsAuthenticated, setJsonWebToken } = useAuth();
    const { translations } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let token: string = jsonWebToken || localStorage.getItem("jsonWebToken") as string;

        if (!token) {
            setIsAuthenticated(false);
            setJsonWebToken("");
            toast.error(translations?.security.errors.unauthorized);
            navigate("/");
            setLoading(false);
            return;
        }

        setJsonWebToken(token);

        instanceWithAuth.get(auth.health)
            .then(() => {
                setIsAuthenticated(true);
            })
            .catch(() => {
                setIsAuthenticated(false);
                setJsonWebToken("");
                toast.error(translations?.security.errors.invalidToken);
                navigate("/");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Spin size="large" />;
    }

    return <>{children}</>;
};

export default Security;
