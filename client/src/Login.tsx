import { useState } from "react";
import "./scss/Login.scss"

// import * as bootstrap from 'bootstrap'

export function LoginTitle() {
    return (
        <>
            <h1 className="text-center">ClassHub</h1>
        </>
    );
}

export function LoginDialog() {
    const [emailAddress, setEmailAddress] = useState("");

    function changeEmailAddress(ev: React.ChangeEvent<HTMLInputElement>) {
        setEmailAddress(ev.target.value);
        console.log(emailAddress);
    }

    function login(ev: React.SubmitEvent<HTMLFormElement>) {
        ev.preventDefault();
        console.log(`pretend i submitted with ${emailAddress} and password`);
    }

    return (
        <>
            <form className="login-form" onSubmit={login}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={emailAddress} onChange={changeEmailAddress} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </>
    );
}