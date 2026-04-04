import MainLayout from "../layouts/Section.tsx";
import { useAuth } from "../context/AuthContext.tsx";

export default function DashboardPage() {
    const { token } = useAuth();
    
    return (
        <MainLayout>
            <div className="card bg-base-100 shadow-xl border border-base-300 w-full max-w-2xl mx-auto mt-8">
                <div className="card-body">
                    <h2 className="card-title text-3xl mb-4">Dashboard</h2>
                    <p className="text-lg">Welcome to the secure dashboard zone!</p>
                    <div className="mt-4 p-4 bg-base-200 rounded-lg overflow-x-hidden text-left">
                        <p className="font-bold mb-2">Your Current Token:</p>
                        <code className="text-sm break-all text-primary">{token}</code>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
