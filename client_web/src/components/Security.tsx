// import React, { useEffect } from "react";
// import { useAuth } from "../Context/ContextHooks";
// import { useNavigate } from "react-router-dom";

type SecurityProps = {
    children: React.ReactNode;
};

const Security = ({ children }: SecurityProps) => {
    // const { isAuthenticated } = useAuth();
    // const navigate = useNavigate();

    // TODO: Connect to the backend and check if the user is authenticated
    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         navigate("/");
    //     }
    // }, [isAuthenticated, navigate]);

    // if (!isAuthenticated) {
    //     return null;
    // }

    return <>{children}</>;
};

export default Security;
