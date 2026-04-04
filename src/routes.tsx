import { createBrowserRouter } from 'react-router';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import APIStatusPage from './pages/APIStatusPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

const ReactRouter = createBrowserRouter([
    { path: '/', Component: HomePage },
    { path: '/contact', Component: ContactPage },
    { path: '/login', Component: LoginPage },
    { path: '/api-status', Component: APIStatusPage },
    { path: '/dashboard', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> }
]);

export default ReactRouter