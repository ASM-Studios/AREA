import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ContextManager } from "./Context/ContextManager.tsx";

import NotFound from './pages/NotFound';
import Layout from './Layout';

const App = () => {
    return (
        <ContextManager>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<></>} />
                        <Route path="/login" element={<></>} />
                        <Route path="/register" element={<></>} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            </Router>
        </ContextManager>
    );
};

export default App;
