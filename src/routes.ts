import { createBrowserRouter } from 'react-router';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';

const ReactRouter = createBrowserRouter([
    { path: '/', Component: HomePage },
    { path: '/contact', Component: ContactPage }
]);

export default ReactRouter