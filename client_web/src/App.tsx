import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ContextManager } from "./Context/ContextManager.tsx";

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Layout from './Layout';
import Login from './pages/Auth/Login.tsx';
import Register from './pages/Auth/Register.tsx';

import LinkedinCallback from "./pages/Auth/LinkedinCallback.tsx";
import SpotifyCallback from './pages/Auth/SpotifyCallback.tsx';
import MicrosoftCallback from './pages/Auth/MicrosoftCallback.tsx';

import Dashboard from './pages/Dashboard/Dashboard.tsx';

const App = () => {
    return (
        <ContextManager>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/auth/spotify/callback" element={<SpotifyCallback />} />
                        <Route path="/auth/microsoft/callback" element={<MicrosoftCallback />} />
                        <Route path="/auth/linkedin/callback" element={<LinkedinCallback />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            </Router>
        </ContextManager>
    );
};

export default App;
