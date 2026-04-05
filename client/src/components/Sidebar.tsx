import { Link, useNavigate } from "react-router";
import "../scss/App.scss"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export interface SidebarState {
    routes: Map<string, string>;
}

const initialState: SidebarState = {
    routes: new Map<string, string>()
}

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        setRoutes: (state, action: PayloadAction<Map<string, string>>) => {
            state.routes = action.payload;
        }
    }
});

export const { setRoutes } = sidebarSlice.actions;
export default sidebarSlice.reducer;

export interface SidebarViewProps {
    routes: Map<string, string>;
}

export function SidebarView() {
    const routes = useSelector((state: RootState) => state.sidebar.routes);
    const navigate = useNavigate();

    return (
        <>
            <div className="sidebar col-lg-2 h-lg-100 p-0 border-end">
                <div className="d-flex flex-column justify-content-center">
                    <h1 onClick={() => navigate("/")} className="title">CH</h1>
                    {Array.from(routes).map(([name, route]) => <Link to={route} className="nav-btn">{name}</Link>)}
                    <button className="nav-btn">Preferences</button>
                    <button className="nav-btn" onClick={() => navigate("/logout")}>Logout</button>
                </div>
            </div>
        </>
    );
};
