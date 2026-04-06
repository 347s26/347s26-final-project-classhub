import { useNavigate } from "react-router";

export const NotFoundView = () => {
    const navigate = useNavigate();

    return (
        <main className="landing-main">
            <h1 className="mb-3">Where are we?</h1>
            <div className="mb-3">I could not find the page you were looking for.</div>
            <button className="btn btn-primary" onClick={() => navigate("/")}>Back to the landing page</button>
        </main>
    );
};
