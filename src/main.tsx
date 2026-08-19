import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import ReactRouter from './routes'
import { AuthProvider } from './context/AuthContext'
import { store } from './store'

async function enableDemoMode() {
    // Demo mode: mock the decommissioned backend with MSW.
    // Disable with RTCS_DEMO=false to point at a real API (RTCS_API_URL).
    if (import.meta.env.RTCS_DEMO !== 'false') {
        const { worker } = await import('./mocks/browser')
        await worker.start({ onUnhandledRequest: 'bypass' })
    }
}

enableDemoMode().finally(() => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <Provider store={store}>
                <AuthProvider>
                    <RouterProvider router={ReactRouter} />
                </AuthProvider>
            </Provider>
        </StrictMode>,
    )
})
