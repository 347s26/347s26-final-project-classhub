import { useEffect, useState } from "react";
import { EditableMarkdown } from "../components/EditableMarkdown";
import { EditableText } from "../components/EditableText";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { setRoutes } from "../components/Sidebar";
import { CourseInstance } from "../models/CourseInstance";
import { Assignment } from "../models/Assignment";
import { probeEffect } from "./Views";

export interface CourseAssignmentParams {
    id: number;
    aid: number;
}

export function CourseAssignmentView() {
    function getParams() {
        const { id, aid } = useParams();
        return {
            id: id ? parseInt(id) : null,
            aid: aid ? parseInt(aid) : null
        } as CourseAssignmentParams;
    }
    const { id, aid } = getParams();
    if (!id || !aid)
        return <div>Identifiers are malformed</div>;

    const dispatch = useDispatch();

    dispatch(setRoutes(new Map<string, string>([
        ["Overview", `/courses/${id}`],
        ["Assignments", `/courses/${id}/assignments`],
        ["Integrations", `/courses/${id}/integrations`]
    ])));

    const navigate = useNavigate();

    useEffect(probeEffect(navigate), []);

    const [course, setCourse] = useState<CourseInstance | null>(null);
    const [assignment, setAssignment] = useState<Assignment | null>(null); 

    useEffect(() => {
        async function _() {
            const course = await CourseInstance.from(id);
            const assignment = await Assignment.from(aid);
            setCourse(course);
            setAssignment(assignment);
        }
        _();
        return () => {};
    }, []);

    if (!course || !assignment)
        return <div>Unable to retrieve assignment</div>;

    return (
        <>
            <EditableText name="Title" content={assignment.title} inline={false} className="h2" save={async (c: string) => { assignment.title = c; return await assignment.save(); }} />
            <EditableMarkdown name="Description" content={assignment.description} save={async (c: string) => { assignment.description = c; return await assignment.save(); }} />
        </>
    );
}