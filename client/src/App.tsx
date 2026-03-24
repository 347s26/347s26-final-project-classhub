import { useEffect, useState, type JSX } from "react"
import "./scss/App.scss"
import { setViewUpdater, View } from "./views/View"
import { DashboardView } from "./views/Dashboard";

function App() {
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

    const [view, setView] = useState<View>(DashboardView.getInstance());
    setViewUpdater(setView);
    const [body, setBody] = useState<JSX.Element | null>(null);
    const [links, setLinks] = useState<Map<string, () => void>>(new Map());

    useEffect(() => {
        async function _() {
            const body = await view.render();
            setBody(body);
            setLinks(view.links);
        }

        _();
    }, [view]);

    return (
        <>
            <main className="default-main">
                <div className="container-fluid h-lg-100">
                    <div className="row h-lg-100">
                        <div className="sidebar col-lg-2 h-lg-100 p-0 border-end">
                            <div className="d-flex flex-column justify-content-center">
                                <h1 className="title" onClick={() => View.redirect(DashboardView.getInstance())}>CH</h1>
                                {Array.from(links).map(([name, navigate]) => <button className="nav-btn" onClick={navigate}>{name}</button>)}
                                <button className="nav-btn">Settings</button>
                            </div>
                        </div>
                        <div className="col-lg-10 p-lg-5 p-4">
                            {body}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default App
