import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ContextManager } from "./Context/ContextManager.tsx";
import { uri } from './Config/uri.ts';

import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import Layout from './components/Layout/Layout.tsx';
import Login from './Pages/Auth/Forms/Login.tsx';
import Register from './Pages/Auth/Forms/Register.tsx';

import LinkedinCallback from "./Pages/Auth/Callback/LinkedinCallback.tsx";
import SpotifyCallback from './Pages/Auth/Callback/SpotifyCallback.tsx';
import MicrosoftCallback from './Pages/Auth/Callback/MicrosoftCallback.tsx';
import DiscordCallback from './Pages/Auth/Callback/DiscordCallback.tsx';

import Dashboard from './Pages/Dashboard/Dashboard.tsx';

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
                        <Route path={uri.spotify.auth.redirectUri.replace(window.location.origin, "")} element={<SpotifyCallback />} />
                        <Route path={uri.microsoft.auth.redirectUri.replace(window.location.origin, "")} element={<MicrosoftCallback />} />
                        <Route path={uri.linkedin.auth.redirectUri.replace(window.location.origin, "")} element={<LinkedinCallback />} />
                        <Route path={uri.discord.auth.redirectUri.replace(window.location.origin, "")} element={<DiscordCallback />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            </Router>
        </ContextManager>
    );
};

export default App;
