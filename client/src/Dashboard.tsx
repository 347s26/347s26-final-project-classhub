import type { JSX } from "react";
import { View } from "./View";
import { CourseInstance, Semester, type Course, type RawCourseInstance } from "./Model";
import { API_URL } from "./Constants";
import "./scss/Dashboard.scss"

export class Dashboard extends View
{
    static instance: Dashboard | null = null;

    private constructor() {
        super("Dashboard");
    }

    private async getCourses(): Promise<CourseInstance[] | null> {
        let raw: RawCourseInstance[] | null = null;
        try
        {
            let req = await fetch(`${API_URL}/courses`);
            raw = (await req.json())["result"];
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
        for (const course of courses)
        {
            const detail = await course.getCourse();
            if (!detail)
                continue;
            for (let i = 0; i < 16; ++i)
            {
                courseRenders.push((
                    <>
                        <div className="p-4 ms-3 mb-3 border">
                            <h3>{detail.title}</h3>
                            <div>{detail.department_code} {detail.number}</div>
                            <div>{Semester[course.semester]} {course.year} (Section {course.section_number})</div>
                        </div>
                    </>
                ));
            }
        }

        return (
            <>
                <h2 className="p-3">Courses</h2>
                <div className="cards">
                    {courseRenders}
                </div>
            </>
        );
    }

    static getInstance() {
        return this.instance ?? (this.instance = new Dashboard());
    }
}
