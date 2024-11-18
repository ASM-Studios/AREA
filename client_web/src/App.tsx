import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ContextManager } from "./Context/ContextManager.tsx";

import NotFound from './pages/NotFound';
import Layout from './Layout';
import Login from './pages/Auth/Login.tsx';
import Register from './pages/Auth/Register.tsx';

const App = () => {
    return (
        <ContextManager>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<><p>Home</p></>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            </Router>
        </ContextManager>
    );
};

export default App;
