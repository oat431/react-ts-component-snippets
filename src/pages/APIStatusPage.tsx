import MainLayout from '../layouts/Section.tsx';
import { useEffect, useState } from 'react';
import { healthCheck } from '../service/HealthCheckService.ts';

export default function APIStatusPage() {
    const [status, setStatus] = useState<string>('Loading...');

    useEffect(() => {
        async function fetchStatus() {
            try {
                const data = await healthCheck() as string;
                setStatus(data);
            } catch (_error) {
                setStatus(`Error: ${String(_error)}`);
            }
        }
        void fetchStatus();
    }, []);

    return (
        <MainLayout>
            <h1 className="text-2xl font-bold mb-4">API Status</h1>
            <p className="text-lg">{status}</p>
        </MainLayout>
    )
}