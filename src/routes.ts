import { createBrowserRouter } from 'react-router';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';

const ReactRouter = createBrowserRouter([
    { path: '/', Component: HomePage },
    { path: '/contact', Component: ContactPage },
    { path: '/login', Component: LoginPage }
]);

export default ReactRouter