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
