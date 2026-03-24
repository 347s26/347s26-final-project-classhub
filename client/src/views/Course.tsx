import { type JSX } from "react";
import { View } from "./View";
import { CourseInstance, Semester } from "../Model";
import "../scss/Course.scss";
import { CourseAssignmentListView } from "./CourseAssignmentList";
import { EditableMarkdown } from "../components/EditableMarkdown";
import { EditableText } from "../components/EditableText";

export class CourseView extends View {
    id: number;

    constructor(id: number) {
        super("Course", `/courses/${id}`, CourseView.links(id));
        this.id = id;
    }
    
    async render(): Promise<JSX.Element> {
        const course = await CourseInstance.from(this.id, true);
        const detail = await course?.getCourse();
        const content = await course?.getCourseContent();

        if (!course || !detail || !content)
            return <p>Ur bad</p>;

        return (
            <>
                <EditableText name="Title" content={detail.title} inline={false} className="h2 fst-italic" save={(async (c: string) => false)} />
                <h3 className="fs-4">
                    <EditableText name="Department Code" content={detail.department_code} inline={true} className="" save={(async (c: string) => false)} />
                    &nbsp;
                    <EditableText name="Course Number" content={detail.number.toString()} inline={true} className="" save={(async (c: string) => false)} />
                    , {Semester[course.semester]} {course.year} (Section {course.section_number})
                </h3>
                <EditableMarkdown name="Overview" content={content.overview} save={async (c: string) => { content.overview = c; return await content.save(); }} />
                <EditableMarkdown name="Syllabus" content={content.syllabus} save={async (c: string) => { content.syllabus = c; return await content.save(); }} />
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