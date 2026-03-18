import type { JSX } from "react";
import { View } from "./View";
import { CourseInstance } from "../Model";
import { CourseView } from "./Course";
import { ErrorView } from "./Error";
import "../scss/Course.scss";
import { CourseAssignmentView } from "./CourseAssignment";

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

export class CourseAssignmentListView extends View {
    id: number;

    constructor(id: number) {
        super("Course Assignments", `/courses/${id}/assignments`, CourseAssignmentListView.links(id));
        this.id = id;
    }

    async render(): Promise<JSX.Element> {
        const course = await CourseInstance.from(this.id);
        const content = await course?.getCourseContent();
        const assignments = (await content?.getAssignments())
            ?.toSorted((a, b) => dateComparator(b.due_date, a.due_date));
        if (!course || !content || !assignments)
        {
            View.redirect(new ErrorView("Cannot connect to server"));
            return <></>;
        }

        const assignmentRenders = assignments.map(assignment => (
            <div className="assignment" onClick={() => View.redirect(new CourseAssignmentView(this.id, assignment.id))}>
                <div className="container-fluid p-0">
                    <div className="row d-flex align-items-center">
                        <div className="col-lg-8 col">
                            <h3 className="fs-4 mb-0">{assignment.title}</h3>
                        </div>
                        <div className="col-lg-4 col text-end">Due: {assignment.due_date ? fmtDate(assignment.due_date) : ""}</div>
                    </div>
                </div>
            </div>
        ));


        return (
            <>
                <h2 className="mb-lg-5 mb-3">Assignments</h2>
                {assignmentRenders}
            </>
        );
    }

    private static links(id: number): Map<string, () => void> {
        const links = new Map<string, () => void>();
        links.set("Overview", () => View.redirect(new CourseView(id)));
        links.set("Assignments", () => View.redirect(new CourseAssignmentListView(id)));
        return links;
    }
}