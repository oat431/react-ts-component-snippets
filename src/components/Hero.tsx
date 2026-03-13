import { Link } from "react-router"
function HeroSection() {
    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">React Component Collection</h1>
                    <p className="py-6">
                        React + TypeScript + Vite + DaisyUI component collection for learning and practice.
                    </p>
                    <Link to="/contact" className="btn btn-primary">Get Started</Link>
                </div>
            </div>
        </div>
    )
}
export default HeroSection