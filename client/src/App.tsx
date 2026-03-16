import { useEffect, useState, type JSX } from "react"
import "./scss/App.scss"
import { View } from "./View"
import { Dashboard } from "./Dashboard";

function App() {
    const [result, setResult] = useState<number | null>(null);
    const [view, setView] = useState<View>(Dashboard.getInstance());

    useEffect(() => {
        async function get() {
            const req = await fetch("http://localhost:8000/api/test?a=3&b=5");
            const json = await req.json();
            const result: number | null = json["result"];
            setResult(result);
        }

        if (!result)
            get();
    }, []);

    // const token = localStorage.getItem("session-token");

    // if (!token) {
    //     return (
    //         <>
    //             <main className="login-main">
    //                 <LoginTitle />
    //                 <LoginDialog />
    //             </main>
    //         </>
    //     );
    // }

    const [body, setBody] = useState<JSX.Element | null>(null);

    useEffect(() => {
        async function _() {
            const body = await view.render();
            setBody(body);
        }

        if (!body)
            _();
    }, []);

    return (
        <>
            <main className="default-main">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-2 border-end">
                            <div className="d-flex flex-column justify-content-center">
                                <h1 className="text-center p-3">ClassHub</h1>
                                <button className="btn">Settings</button>
                            </div>
                        </div>
                        <div className="col-10">
                            {body}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default App
