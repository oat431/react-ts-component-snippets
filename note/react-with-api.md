# React Integration with API

## Install Axios for API calls

```bash
npm install axios
```

## Integration Steps

1.Create a utility file for API calls:

```typescript
// src/utils/APIClient.ts
import axios from "axios";

const baseURL: string = (import.meta.env.RTCS_API_URL as string) || "http://localhost:8003/api/v1";

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
```

2. Example of using the API client in a service:

```typescript
// src/service/HealthCheckService.ts
import api from "../utils/APIClient";

export async function healthCheck(): Promise<unknown> {
    const response = await api.get("/health-check/health"); // example API endpoint
    return response.data;
}
```

3. How to use in a React component:

```tsx
// src/pages/APIStatusPage.tsx
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
};
```
