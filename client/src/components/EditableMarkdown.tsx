import { type JSX } from "react";
import "../scss/Course.scss";
import { marked } from "marked";
import DOMPurify from "dompurify";

function markdownToHtmlStr(content: string): string {
    return DOMPurify.sanitize(marked.parse(content, { async: false }))
}

export function EditableMarkdown({ name, content, save }: { name: string; content: string, save: (c: string) => Promise<boolean>}): JSX.Element {
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
