import { useEffect, useState } from "react";
import { EnumSelectorField, FullForm, ObjectSelectorField, ShortTextField } from "../components/FullForm";
import { useNavigate } from "react-router";
import { Course } from "../models/Course";
import { CourseContent } from "../models/CourseContent";
import { CourseInstance, Semester } from "../models/CourseInstance";
import type { RelatedObject } from "../models/Models";

export function CourseCreatorView() {
    const navigate = useNavigate();

    const [courses, setCourses] = useState<Course[] | null>(null);

    useEffect(() => {
        async function _() {
            const courses = await Course.all();
            if (!courses)
                navigate("/disconnected");
            setCourses(courses);
        }
        _();
        return () => {};
    }, []);

    if (!courses)
        return <div>Loading...</div>;

    async function submit(data: Map<string, RelatedObject>): Promise<string | null> {
        const content = data.get("content") as CourseContent;
        const semester = data.get("semester") as number;
        const year = data.get("year") as number;
        const sectionNumber = data.get("section-number") as number;
        const instance = await CourseInstance.make(content.id, semester, year, sectionNumber);
        if (!instance)
            return "Could not create course instance.";
        navigate("/dashboard");
        return null;
    }

    const options = new Map(Object.entries(Semester).filter(([k]) => isNaN(Number(k))) as [string, number][]);

    return (
        <FullForm id="create-course" title="Create Course" submitter={submit}>
            <ObjectSelectorField id="course" name="Course" thing="Course" tip="This is the course from the catalog that is being taught." searcher={Course.all} />
            <ObjectSelectorField id="content" name="Associated Content" thing="Course Content" tip="This is where to derive the content of the course from." searcher={CourseContent.all} />
            <EnumSelectorField id="semester" name="Semester" thing="Semester" tip="This is the semester in which this course is being offered." options={options} />
            <ShortTextField id="year" name="Year" thing="number" tip="This is the year in which this course is being offered." converter={parseInt} />
            <ShortTextField id="section-number" name="Section Number" thing="number" tip="This is the section number for this course within the semester provided." converter={parseInt} />
        </FullForm>
    )
}
