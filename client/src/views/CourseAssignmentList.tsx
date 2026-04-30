import { useEffect, useState } from "react";
import "../scss/Course.scss";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { setRoutes } from "../components/Sidebar";
import { CourseInstance } from "../models/CourseInstance";
import { probeEffect, toastify } from "./Views";
import { Assignment } from "../models/Assignment";
import * as bootstrap from 'bootstrap';
import { Confirmer } from "../components/Confirmer";

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

interface CourseAssignmentListEntryProps {
    courseID: number;
    assignment: Assignment;
    bulk: boolean;
    bulkItems: Assignment[];
}

function CourseAssignmentListEntry({ courseID, assignment, bulk, bulkItems }: CourseAssignmentListEntryProps) {
    const navigate = useNavigate();

    const changeChecked: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (ev) => {
        if (ev.target.checked) {
            bulkItems.push(assignment);
        } else {
            bulkItems.splice(bulkItems.indexOf(assignment), 1);
        }
    };

    return (
        <>
            <div className={!bulk ? "assignment" : "assignment-unclickable"} onClick={() => !bulk ? navigate(`/courses/${courseID}/assignments/${assignment.id}`) : null}>
                <div className="d-flex flex-column">
                    {bulk ? (
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="checkDefault" onChange={changeChecked} />
                        </div>
                    ) : <></>}
                    <h3 className="fs-4 mb-0">{assignment.title}</h3>
                    <div className="col-lg-4 col">Due: {assignment.due_date ? fmtDate(assignment.due_date) : ""}</div>
                </div>
            </div>
        </>
    )
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

    useEffect(probeEffect(navigate), []);

    dispatch(setRoutes(new Map<string, string>([
        ["Overview", `/courses/${id}`],
        ["Assignments", `/courses/${id}/assignments`],
        ["Integrations", `/courses/${id}/integrations`],
        ["Settings", `/courses/${id}/settings`]
    ])));

    const [course, setCourse] = useState<CourseInstance | null>(null);
    const [bulk, setBulk] = useState<boolean>(false);
    const [bulkItems] = useState<Assignment[]>([]);

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

    const selectBtnID = "select-btn";
    const bulkDeleteBtnID = "bulk-delete-btn";
    const bulkOptionsID = "bulk-options";

    function toggleBulk() {
        const selectBtn = document.getElementById(selectBtnID) as HTMLButtonElement;
        const bulkOptions = document.getElementById(bulkOptionsID) as HTMLDivElement;
        const nbulk = !bulk;
        setBulk(nbulk);
        if (nbulk) {
            selectBtn.innerText = "Done";
            bulkOptions.style.display = "block";
        } else {
            selectBtn.innerText = "Select";
            bulkOptions.style.display = "none";
        }
    }

    const bulkDeleterID = "bulk-deleter";

    function openBulkDeleter() {
        const bulkDeleter = document.getElementById(bulkDeleterID) as HTMLElement;
        const modal = bootstrap.Modal.getOrCreateInstance(bulkDeleter) as bootstrap.Modal;
        modal.show();
        console.log(`Planning to delete ${bulkItems.length} items`);
    }

    async function bulkDeleter() {
        const bulkDeleter = document.getElementById(bulkDeleterID) as HTMLElement;
        const modal = bootstrap.Modal.getOrCreateInstance(bulkDeleter) as bootstrap.Modal;
        let deleted = 0;
        for (const assignment of bulkItems) {
            if (await assignment.delete())
                ++deleted;
        }
        modal.hide();
        navigate(0);
        toastify(`Deleted ${deleted} assignments`, "Info");
    }

    return (
        <>
            <div className="d-flex align-items-center mb-4">
                <h2 className="mb-0">Assignments</h2>
                <button id={selectBtnID} className="edit-btn ms-3" onClick={toggleBulk}>Select</button>
                <div id="bulk-options" style={{ display: "none" }}>
                    <button id={bulkDeleteBtnID} className="btn btn-danger ms-3" onClick={openBulkDeleter}>Delete</button>
                </div>
            </div>
            {assignments.map(assignment => <CourseAssignmentListEntry courseID={id} assignment={assignment} bulk={bulk} bulkItems={bulkItems} />)}
            <Confirmer id={bulkDeleterID} actionDescription="delete the selected items" action={bulkDeleter} />
        </>
    );
}
