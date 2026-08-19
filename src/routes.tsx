import { createBrowserRouter } from 'react-router';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import APIStatusPage from './pages/APIStatusPage';
import DashboardPage from './pages/DashboardPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import HooksPage from './pages/HooksPage';
import CartPage from './pages/CartPage';
import PerformancePage from './pages/PerformancePage';
import ProtectedRoute from './components/ProtectedRoute';

const ReactRouter = createBrowserRouter([
    { path: '/', Component: HomePage },
    { path: '/contact', Component: ContactPage },
    { path: '/login', Component: LoginPage },
    { path: '/register', Component: RegisterPage },
    { path: '/verify-email', Component: VerifyEmailPage },
    { path: '/api-status', Component: APIStatusPage },
    { path: '/hooks', Component: HooksPage },
    { path: '/cart', Component: CartPage },
    { path: '/performance', Component: PerformancePage },
    { path: '/dashboard', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
]);

export default ReactRouter;