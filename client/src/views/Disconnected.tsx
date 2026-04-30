import { useNavigate } from "react-router";

export const DisconnectedView = () => {
    const navigate = useNavigate();

    return (
        <main className="landing-main">
            <h1 className="mb-3">Disconnected</h1>
            <div className="mb-3">The server backing this ClassHub instance is not online.</div>
            <button className="btn btn-primary" onClick={() => navigate("/")}>Back to the landing page</button>
        </main>
    );
};
