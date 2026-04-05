import { useEffect, useState } from "react";
import "../scss/Course.scss";
import { EditableMarkdown } from "../components/EditableMarkdown";
import { EditableText } from "../components/EditableText";
import { useDispatch } from "react-redux";
import { setRoutes } from "../components/Sidebar";
import { useNavigate, useParams } from "react-router";
import { CourseInstance, Semester } from "../models/CourseInstance";
import { probeEffect } from "./Views";

interface CourseParams {
    id: number | null;
}

export function CourseView() {
    function getParams() {
        const { id } = useParams();
        return {
            id: id ? parseInt(id) : null
        } as CourseParams;
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

    const [course, setCourse] = useState<CourseInstance | null>(null);

    useEffect(() => {
        async function _() {
            const course = await CourseInstance.from(id ?? 0, true);
            if (!await course?.getCourse())
                return;
            if (!await course?.getCourseContent())
                return;
            setCourse(course);
        }
        _();
        return () => {};
    }, []);

    const detail = course?.getCourseSync();
    const content = course?.getCourseContentSync();

    if (!course || !detail || !content)
        return <div>Unable to retrieve course</div>;

    return (
        <>
            <EditableText name="Title" content={detail.title} inline={false} className="h2 fst-italic" save={(async (_: string) => false)} />
            <h3 className="fs-4">
                <EditableText name="Department Code" content={detail.department_code} inline={true} className="" save={(async (_: string) => false)} />
                &nbsp;
                <EditableText name="Course Number" content={detail.number.toString()} inline={true} className="" save={(async (_: string) => false)} />
                , {Semester[course.semester]} {course.year} (Section {course.section_number})
            </h3>
            <EditableMarkdown name="Overview" content={content.overview} save={async (c: string) => { content.overview = c; return await content.save(); }} />
            <EditableMarkdown name="Syllabus" content={content.syllabus} save={async (c: string) => { content.syllabus = c; return await content.save(); }} />
        </>
    );
}
