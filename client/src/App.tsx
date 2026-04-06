import "./scss/App.scss"
import { Provider } from "react-redux";
import store from "./store";
import { Outlet, Route, Routes } from "react-router";
import { NotFoundView } from "./views/NotFound";
import { SidebarView } from "./components/Sidebar";
import { CourseView } from "./views/Course";
import { CourseAssignmentView } from "./views/CourseAssignment";
import { CourseIntegrationListView } from "./views/CourseIntegrationList";
import { CourseAssignmentListView } from "./views/CourseAssignmentList";
import { LoginView } from "./views/Login";
import { SignupView } from "./views/Signup";
import { LogoutView } from "./views/Logout";
import { CourseSettingsView } from "./views/CourseSettings";
import { DashboardView } from "./views/Dashboard";
import { LandingView } from "./views/Landing";
import { CourseCreatorView } from "./views/CourseCreator";

function Layout() {
    return (
        <>
            <main className="default-main">
                <div className="container-fluid">
                    <div className="row">
                        <SidebarView />
                        <div className="col-lg-10 p-lg-5 p-4">
                            <Outlet />
                        </div>
                    </div>
                </div>
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div id="global-toast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <strong className="me-auto" id="global-toast-title"></strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div className="toast-body" id="global-toast-content"></div>
                    </div>
                </div>
            </main>
        </>
    );
}

function App() {
    return (
        <Provider store={store}>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="dashboard" element={<DashboardView />} />
                    <Route path="courses">
                        <Route index element={<NotFoundView />} />
                        <Route path="new" element={<CourseCreatorView />} />
                        <Route path=":id" element={<CourseView />} />
                        <Route path=":id/settings" element={<CourseSettingsView />} />
                        <Route path=":id/assignments" element={<CourseAssignmentListView />} />
                        <Route path=":id/assignments/:aid" element={<CourseAssignmentView />} />
                        <Route path=":id/integrations" element={<CourseIntegrationListView />} />
                    </Route>
                    <Route path="logout" element={<LogoutView />} />
                </Route>
                <Route path="/" element={<LandingView />} />
                <Route path="login" element={<LoginView />} />
                <Route path="signup" element={<SignupView />} />
                <Route path="*" element={<NotFoundView />} />
            </Routes>
        </Provider>
    );
}

export default App;
