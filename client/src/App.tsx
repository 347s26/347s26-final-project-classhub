import "./scss/App.scss"
import { DashboardView } from "./views/Dashboard";
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

function Layout() {
    return (
        <>
            <main className="default-main">
                <div className="container-fluid h-lg-100">
                    <div className="row h-lg-100">
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
                    <Route path="/" element={<DashboardView />} />
                    <Route path="courses">
                        <Route index element={<NotFoundView />} />
                        <Route path=":id" element={<CourseView />} />
                        <Route path=":id/settings" element={<CourseSettingsView />} />
                        <Route path=":id/assignments" element={<CourseAssignmentListView />} />
                        <Route path=":id/assignments/:aid" element={<CourseAssignmentView />} />
                        <Route path=":id/integrations" element={<CourseIntegrationListView />} />
                    </Route>
                    <Route path="logout" element={<LogoutView />} />
                    <Route path="*" element={<NotFoundView />} />
                </Route>
                <Route path="login" element={<LoginView />} />
                <Route path="signup" element={<SignupView />} />
            </Routes>
        </Provider>
    );
}

export default App;
