import React, { useState, useEffect } from "react";
import { useAuth } from "@/Context/ContextHooks";
import { useNavigate } from "react-router-dom";
import { Spin } from 'antd';
import { instanceWithAuth, auth } from "@Config/backend.routes";

type SecurityProps = {
    children: React.ReactNode;
};

const Security = ({ children }: SecurityProps) => {
    const { isAuthenticated, jsonWebToken, setIsAuthenticated, setJsonWebToken } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            if (!isAuthenticated || !jsonWebToken) {
                if (localStorage.getItem("jsonWebToken")) {
                    instanceWithAuth.get(auth.health)
                        .then(() => {
                            setIsAuthenticated(true);
                            setJsonWebToken(localStorage.getItem("jsonWebToken") as string);
                        })
                        .catch((error) => {
                            console.error(error);
                            setIsAuthenticated(false);
                            setJsonWebToken("");
                            localStorage.removeItem("jsonWebToken");
                            navigate("/");
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                } else {
                    localStorage.removeItem("jsonWebToken");
                    setIsAuthenticated(false);
                    setJsonWebToken("");
                    navigate("/");
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, [isAuthenticated, jsonWebToken]);

    if (loading) {
        return <Spin size="large" />;
    }

    return <>{children}</>;
};

export default Security;
