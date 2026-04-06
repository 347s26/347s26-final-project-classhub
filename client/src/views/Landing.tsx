import { useNavigate } from "react-router";

export function LandingView() {
    const navigate = useNavigate();

    return (
        <main className="landing-main">
            <h1 className="text-center">ClassHub</h1>
            <div className="fs-3 text-center mb-3">Your solution for handling all of those learning management systems.</div>
            <div className="d-flex">
                <button className="btn btn-primary me-2" onClick={() => navigate("/login")}>Login</button>
                <button className="btn btn-secondary ms-2"  onClick={() => navigate("/signup")}>Create account</button>
            </div>
        </main>
    );
}
