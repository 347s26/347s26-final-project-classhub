import { useEffect, useState } from "react";
import "../scss/Dashboard.scss";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setRoutes } from "../components/Sidebar";
import { CourseInstance, Semester } from "../models/CourseInstance";
import { getCourses } from "../models/Models";
import { probeEffect } from "./Views";

export function DashboardView() {
    const [courses, setCourses] = useState<CourseInstance[] | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(probeEffect(navigate), []);

    dispatch(setRoutes(new Map<string, string>()));

    useEffect(() => {
        async function _() {
            const courses = await getCourses();
            if (!courses) return;
            for (const course of courses)
                await course.getCourse();
            setCourses(courses);
        }
        _();
        return () => {};
    }, []);

    return (
        <>
            <div className="d-flex align-items-center mb-4">
                <h2 className="mb-0">Courses</h2>
                <button className="edit-btn ms-3">New</button>
            </div>
            <div className="course-cards">
                {courses?.map(course => {
                    const detail = course.getCourseSync();
                    return (
                        <>
                            <div className="course-card" key={course.id} onClick={() => navigate(`/courses/${course.id}`)}>
                                <h3 className="fs-4">{detail?.title}</h3>
                                <div>{detail?.department_code} {detail?.number}</div>
                                <div>{Semester[course.semester]} {course.year} (Section {course.section_number})</div>
                            </div>
                        </>
                    );
                }) ?? <div>Loading...</div>}
            </div>
        </>
    )
}
