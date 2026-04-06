import { useEffect, useState } from "react";
import "../scss/Login.scss"
import { login } from "../models/Models";
import * as bootstrap from 'bootstrap'
import { useNavigate } from "react-router";

export function LoginView() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("session"))
            navigate("/dashboard");
        return () => {};
    }, []);

    const toastID = `login-toast`;
    const toastContentID = `login-toast-content`;

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");

    function changeEmailAddress(ev: React.ChangeEvent<HTMLInputElement>) {
        setEmailAddress(ev.target.value);
    }

    function changePassword(ev: React.ChangeEvent<HTMLInputElement>) {
        setPassword(ev.target.value);
    }

    async function submit(ev: React.SubmitEvent<HTMLFormElement>) {
        const toastElement = document.getElementById(toastID);
        const toastContent = document.getElementById(toastContentID);
        if (!toastElement || !toastContent)
        {
            console.log("bad");
            return;
        }
        ev.preventDefault();
        console.log("logging up yo");
        const result = await login(emailAddress, password);
        if (!result.token)
        {
            const err = `${result.errors[0].message} (on ${result.errors[0].param})`;
            const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
            toastContent.innerText = err;
            toast?.show();
            return;
        }
        localStorage.setItem("session", result.token);
        navigate("/dashboard");
    }

    return (
        <main className="login-main">
            <h1 className="text-center">ClassHub</h1>
            <form className="login-form" onSubmit={submit}>
                <div className="mb-3">
                    <label htmlFor="email-input" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email-input" value={emailAddress} onChange={changeEmailAddress} />
                </div>
                <div className="mb-3">
                    <label htmlFor="pass-input" className="form-label">Password</label>
                    <input type="password" className="form-control" id="pass-input" value={password} onChange={changePassword} />
                </div>
                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">Login</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/signup")}>Need an account?</button>
                </div>
            </form>
            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div id={toastID} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <strong className="me-auto">Error</strong>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div className="toast-body" id={toastContentID}></div>
                </div>
            </div>
        </main>
    );
}