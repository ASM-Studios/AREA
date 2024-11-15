import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NotFound from './pages/NotFound.tsx'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<></>} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default App
