import { useEffect } from "react";
import { useNavigate } from "react-router";

export function LogoutView() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("session");
        navigate("/login");
        return () => {};
    }, []);

    return <div>Logging out...</div>;
}