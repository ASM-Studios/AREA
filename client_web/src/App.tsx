import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ContextManager } from "@/Context/ContextManager";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
    type ISourceOptions,
    MoveDirection,
    OutMode,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

import Home from '@/Pages/Home';
import NotFound from '@/Pages/Errors/NotFound';
import ApiNotConnected from "@/Pages/Errors/ApiNotConnected";
import CustomError from "@/Pages/Errors/CustomError";

import UserPage from "@/Pages/Account/UserPage";

import Layout from '@/Components/Layout/Layout';
import Login from '@/Pages/Auth/Forms/Login';
import Register from '@/Pages/Auth/Forms/Register';

import GenericCallback from "@/Pages/Auth/Callback/GenericCallback";

import UpdateWorkflow from "@/Pages/Workflows/UpdateWorkflow";
import WorkflowHandler from '@/Pages/Workflows/WorkflowHandler';

import Dashboard from './Pages/Dashboard/Dashboard';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const [init, setInit] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("#FFA500");

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
        setBackgroundColor(sessionStorage.getItem("backgroundColor") || "#FFA500");
    }, []);

    const particlesLoaded = async (): Promise<void> => {};

    const options: ISourceOptions = useMemo(
        () => ({
            background: {
                color: {
                    value: backgroundColor,
                },
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                },
                modes: {
                    push: {
                        quantity: 1,
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: "#ffffff",
                },
                links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                },
                move: {
                    direction: MoveDirection.none,
                    enable: true,
                    outModes: {
                        default: OutMode.out,
                    },
                    random: false,
                    speed: 6,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                    },
                    value: 80,
                },
                opacity: {
                    value: 0.5,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 5 },
                },
            },
            detectRetina: true,
        }),
        [backgroundColor],
    );

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {init && (
                <Particles
                    id="tsparticles"
                    particlesLoaded={particlesLoaded}
                    options={options}
                    style={{ position: 'absolute', zIndex: 0 }}
                />
            )}
            <ContextManager>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home backgroundColor={backgroundColor} />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={<Dashboard />} />

                            <Route path="/auth/:service/callback" element={<GenericCallback />} />

                            <Route path="/workflow/create" element={<WorkflowHandler />} />
                            <Route path="/workflow/update/:id" element={<UpdateWorkflow />} />

                            <Route path="/account/me" element={<UserPage backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />} />

                            <Route path="/error/connection" element={<ApiNotConnected />} />
                            <Route path="/error/:error" element={<CustomError />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Layout>
                </Router>
            </ContextManager>
        </>
    );
};

export default App;
