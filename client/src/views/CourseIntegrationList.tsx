import { useDispatch } from "react-redux";
import { setRoutes } from "../components/Sidebar";
import { useNavigate, useParams } from "react-router";
import { probeEffect } from "./Views";
import { useEffect } from "react";

interface CourseIntegrationListParams {
    id: number;
}

export function CourseIntegrationListView() {
    function getParams() {
        const { id } = useParams();
        return {
            id: id ? parseInt(id) : null
        } as CourseIntegrationListParams;
    }

    const { id } = getParams();
    if (!id)
        return <div>No course ID provided</div>;

    const dispatch = useDispatch();

    dispatch(setRoutes(new Map<string, string>([
        ["Overview", `/courses/${id}`],
        ["Assignments", `/courses/${id}/assignments`],
        ["Integrations", `/courses/${id}/integrations`]
    ])));

    const navigate = useNavigate();

    useEffect(probeEffect(navigate), []);

    return <></>;
}