import type { JSX } from "react";
import { View } from "./View";
import { CourseInstance, Semester, type RawCourseInstance } from "../Model";
import { API_URL } from "../Constants";
import "../scss/Dashboard.scss";
import { CourseView } from "./Course";

export class DashboardView extends View
{
    static instance: DashboardView | null = null;

    private constructor() {
        super("Dashboard", "/", new Map<string, () => void>());
    }

    private async getCourses(): Promise<CourseInstance[] | null> {
        let raw: RawCourseInstance[] | null = null;
        try
        {
            let req = await fetch(`${API_URL}/courses`);
            raw = (await req.json())["data"];
        }
        catch
        {
            return null;
        }
        if (!raw) return null;
        return raw.map(r => new CourseInstance(r));
    }

    async render(): Promise<JSX.Element> {
        const courses = await this.getCourses() ?? [];
        console.log(courses);

        const courseRenders: JSX.Element[] = [];
        for (const i in courses)
        {
            const course = courses[i];
            const detail = await course.getCourse();
            if (!detail)
                continue;
            courseRenders.push((
                <>
                    <div className="card" key={i} onClick={() => View.redirect(new CourseView(course.id))}>
                        <h3 className="fs-4">{detail.title}</h3>
                        <div>{detail.department_code} {detail.number}</div>
                        <div>{Semester[course.semester]} {course.year} (Section {course.section_number})</div>
                    </div>
                </>
            ));
        }

        return (
            <>
                <div className="d-flex align-items-center mb-4">
                    <h2 className="mb-0">Courses</h2>
                    <button className="edit-btn ms-3">New</button>
                </div>
                <div className="cards">
                    {courseRenders}
                </div>
            </>
        );
    }

    static getInstance() {
        return this.instance ?? (this.instance = new DashboardView());
    }
}
