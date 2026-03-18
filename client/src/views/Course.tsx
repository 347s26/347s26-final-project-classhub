import { useEffect, useState, type JSX } from "react";
import { View } from "./View";
import { CourseInstance, Semester } from "../Model";
import "../scss/Course.scss";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { CourseAssignmentListView } from "./CourseAssignmentList";

function markdownToHtmlStr(content: string): string {
    return DOMPurify.sanitize(marked.parse(content, { async: false }))
}

function EditableMarkdown({ name, content, save }: { name: string; content: string, save: (c: string) => Promise<boolean>}): JSX.Element {
    const flattenedName = name.toLowerCase().replace(" ", "-");
    const editorID = `${flattenedName}-editor`;
    const textareaID = `${flattenedName}-textarea`;
    const previewID = `${flattenedName}-preview`;
    const editBtnID = `${flattenedName}-edit-btn`;

    const savingSpinnerID = `${flattenedName}-saving`;
    const saveResultID = `${flattenedName}-save-result`;

    function toggleEditor() {
        const editor = document.getElementById(editorID);
        const preview = document.getElementById(previewID);
        const editBtn = document.getElementById(editBtnID);
        if (!editor || !preview || !editBtn)
        {
            console.log("something bad's afoot");
            return;
        }
        if (editor.style.display == "none")
        {
            editor.style.display = "block";
            preview.style.display = "none";
            editBtn.innerText = "Preview";
        }
        else
        {
            preview.style.display = "block";
            editor.style.display = "none";
            editBtn.innerText = "Edit";
        }
    }

    async function completeSave() {
        const ta = document.getElementById(textareaID);
        const savingSpinner = document.getElementById(savingSpinnerID);
        const saveResult = document.getElementById(saveResultID);
        const preview = document.getElementById(previewID);
        if (!ta || !savingSpinner || !saveResult || !preview || !(ta instanceof HTMLTextAreaElement))
        {
            console.log("bad");
            return;
        }
        savingSpinner.style.display = "block";
        saveResult.style.display = "none";
        content = ta.value;
        const result = await save(ta.value);
        savingSpinner.style.display = "none";
        if (result)
        {
            saveResult.innerText = "👍";
            preview.innerHTML = markdownToHtmlStr(ta.value);
        }
        else
            saveResult.innerHTML = "👎";
        saveResult.style.display = "block";
    }

    return (
        <>
            <div className="d-flex mt-5 align-items-center">
                <div className="h4 mb-0">{name}</div>
                <button id={editBtnID} onClick={toggleEditor} className="edit-btn ms-3">Edit</button>
            </div>
            <hr></hr>
            <div id={editorID} style={{ display: "none" }}>
                <textarea id={textareaID} className="code-textarea">{content}</textarea>
                <div className="d-flex align-items-center">
                    <button className="save-btn" onClick={completeSave}>Save</button>
                    <div id={savingSpinnerID} className="ms-3 spinner-border" role="status" style={{ display: "none" }}>
                        <span className="visually-hidden">Saving...</span>
                    </div>
                    <div id={saveResultID} className="ms-3 fs-3" style={{ display: "none" }}></div>
                </div>
            </div>
            <div id={previewID} dangerouslySetInnerHTML={{ __html: markdownToHtmlStr(content)}}></div>
        </>
    );
}

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
                <h2><em>{detail.title}</em></h2>
                <h3 className="fs-4">{detail.department_code} {detail.number}, {Semester[course.semester]} {course.year} (Section {course.section_number})</h3>
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