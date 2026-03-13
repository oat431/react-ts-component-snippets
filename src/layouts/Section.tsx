import Footer from "../components/Footer"
import NavBar from "../components/NavBar"

function Section({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavBar />
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        {children}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Section