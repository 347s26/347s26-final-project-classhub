import { useEffect, useState } from "react";
import "../scss/Course.scss";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { setRoutes } from "../components/Sidebar";
import { CourseInstance } from "../models/CourseInstance";

function fmtDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
}

function dateComparator(a: Date | null, b: Date | null): number {
    if (!a && !b)
        return 0;
    if (!a)
        return -1;
    if (!b)
        return 1;
    if (a < b)
        return -1;
    else if (a > b)
        return 1;
    else
        return 0;
}

interface CourseAssignmentListParams {
    id: number;
}

export function CourseAssignmentListView() {
    function getParams() {
        const { id } = useParams();
        return {
            id: id ? parseInt(id) : null
        } as CourseAssignmentListParams;
    }

    const { id } = getParams();
    if (!id)
        return <div>No course ID provided</div>;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    dispatch(setRoutes(new Map<string, string>([
        ["Overview", `/courses/${id}`],
        ["Assignments", `/courses/${id}/assignments`],
        ["Integrations", `/courses/${id}/integrations`]
    ])));

    const [course, setCourse] = useState<CourseInstance | null>(null);

    useEffect(() => {
        async function _() {
            const course = await CourseInstance.from(id);
            const content = await course?.getCourseContent();
            await content?.getAssignments();
            setCourse(course);
        }
        _();
        return () => {};
    }, []);

    const content = course?.getCourseContentSync();
    const assignments = content?.getAssignmentsSync()
        ?.toSorted((a, b) => dateComparator(b.due_date, a.due_date));
    if (!content || !assignments)
        return <div>Unable to retrieve assignment list</div>;

    return (
        <>
            <h2 className="mb-lg-5 mb-3">Assignments</h2>
            {assignments.map(assignment => (
                <div className="assignment" onClick={() => navigate(`/courses/${id}/assignments/${assignment.id}`)}>
                    <div className="container-fluid p-0">
                        <div className="row d-flex align-items-center">
                            <div className="col-lg-8 col">
                                <h3 className="fs-4 mb-0">{assignment.title}</h3>
                            </div>
                            <div className="col-lg-4 col text-end">Due: {assignment.due_date ? fmtDate(assignment.due_date) : ""}</div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
