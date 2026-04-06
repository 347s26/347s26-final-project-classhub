import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { setRoutes } from "../components/Sidebar";
import { probeEffect, toastify } from "./Views";
import { useEffect, useState } from "react";
import * as bootstrap from 'bootstrap';
import { Confirmer } from "../components/Confirmer";
import { CourseInstance } from "../models/CourseInstance";

interface CourseSettingsParams {
    id: number;
}

export function CourseSettingsView() {
    function getParams() {
        const { id } = useParams();
        return {
            id: id ? parseInt(id) : null
        } as CourseSettingsParams;
    }

    const { id } = getParams();
    if (!id)
        return <div>No course ID provided</div>;

    const dispatch = useDispatch();

    dispatch(setRoutes(new Map<string, string>([
        ["Overview", `/courses/${id}`],
        ["Assignments", `/courses/${id}/assignments`],
        ["Integrations", `/courses/${id}/integrations`],
        ["Settings", `/courses/${id}/settings`]
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

    const courseDeleterID = "course-deleter";

    function openCourseDeleter() {
        const courseDeleter = document.getElementById(courseDeleterID) as HTMLElement;
        const modal = bootstrap.Modal.getOrCreateInstance(courseDeleter) as bootstrap.Modal;
        modal.show();
    }

    async function courseDeleter() {
        if (await ((course as CourseInstance).delete()))
        {
            const courseDeleter = document.getElementById(courseDeleterID) as HTMLElement;
            const modal = bootstrap.Modal.getOrCreateInstance(courseDeleter) as bootstrap.Modal;
            modal.hide();
            navigate("/dashboard");
        }
        else
            toastify("Couldn't delete the course", "Error");
    }

    return (
        <>
            <h2 className="mb-lg-5 mb-4">Settings</h2>
            <h3 className="fs-4 mb-3">Danger Zone</h3>
            <button className="btn btn-danger" onClick={openCourseDeleter}>Delete</button>
            <Confirmer id={courseDeleterID} actionDescription="delete the course" action={courseDeleter} />
        </>
    );
}
