# React Router

1. Installation

```bash
npm install react-router @react-router/node @react-router/dev
```

2. Usage

create a react page in 'src/pages/*Page.tsx'

then

create 'src/routes.ts'

```typescript
import { createBrowserRouter } from 'react-router';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';

const ReactRouter = createBrowserRouter([
    { path: '/', Component: HomePage },
    { path: '/contact', Component: ContactPage }
]);

export default ReactRouter
```

use in 'src/main.tsx'

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import ReactRouter from './routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={ReactRouter} />
  </StrictMode>,
)
```
