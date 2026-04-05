import { useDispatch } from "react-redux";
import { setRoutes } from "../components/Sidebar";
import { useParams } from "react-router";

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

    return <></>;
}