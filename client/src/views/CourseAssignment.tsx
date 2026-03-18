import type { JSX } from "react";
import { View } from "./View";
import { CourseView } from "./Course";
import { CourseAssignmentListView } from "./CourseAssignmentList";
import { Assignment, CourseInstance } from "../Model";
import { ErrorView } from "./Error";

export class CourseAssignmentView extends View {
    id: number;
    cid: number;

    constructor(id: number, cid: number) {
        super("Course Assignment", `/courses/${cid}/assignments/${id}`, CourseAssignmentView.links(id, cid));
        this.id = id;
        this.cid = cid;
    }

    async render(): Promise<JSX.Element> {
        const course = await CourseInstance.from(this.cid);
        const assignment = await Assignment.from(this.id);
        if (!course || !assignment)
        {
            View.redirect(new ErrorView(`Unable to fetch assignment ID ${this.id}`));
            return <></>;
        }

        return (
            <>
                <h2>{assignment.title}</h2>
            </>
        );
    }

    private static links(id: number, _: number): Map<string, () => void> {
        const links = new Map<string, () => void>();
        links.set("Overview", () => View.redirect(new CourseView(id)));
        links.set("Assignments", () => View.redirect(new CourseAssignmentListView(id)));
        return links;
    }
}