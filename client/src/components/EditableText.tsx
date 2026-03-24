import type { JSX } from "react";

export function EditableText({ name, content, inline = false, className = "", save }: { name: string; content: string; inline: boolean; className: string; save: (c: string) => Promise<boolean> }): JSX.Element {
    const flattenedName = name.toLowerCase().replace(" ", "_");
    const previewID = `${flattenedName}-preview`;
    const editorID = `${flattenedName}-editor`;
    const saveBtnID = `${flattenedName}-save-btn`;
    const cancelBtnID = `${flattenedName}-cancel-btn`;
    const savingSpinnerID = `${flattenedName}-saving-spinner`;
    const saveResultID = `${flattenedName}-save-result`;
    const inputID = `${flattenedName}-input`

    function edit() {
        const editor = document.getElementById(editorID);
        const preview = document.getElementById(previewID);
        if (!editor || !preview)
        {
            console.log("bad");
            return;
        }
        editor.style.display = "flex";
        preview.style.display = "none";
    }

    function reset() {
        const editor = document.getElementById(editorID);
        const preview = document.getElementById(previewID);
        if (!editor || !preview)
        {
            console.log("bad");
            return;
        }
        editor.style.display = "none";
        preview.style.display = inline ? "inline" : "block";
    }

    async function completeSave() {
        const i = document.getElementById(inputID);
        const savingSpinner = document.getElementById(savingSpinnerID);
        const saveResult = document.getElementById(saveResultID);
        const preview = document.getElementById(previewID);
        if (!i || !savingSpinner || !saveResult || !preview || !(i instanceof HTMLInputElement))
        {
            console.log("bad");
            return;
        }
        savingSpinner.style.display = "inline";
        saveResult.style.display = "none";
        content = i.value;
        const result = await save(i.value);
        savingSpinner.style.display = "none";
        if (result)
        {
            saveResult.innerText = "👍";
            preview.innerHTML = i.value;
        }
        else
            saveResult.innerHTML = "👎";
        saveResult.style.display = "inline";
    }
    
    return (
        <span>
            {
                inline ?
                <span id={previewID} onClick={edit} className={"et-preview " + className}>{content}</span> :
                <div id={previewID} onClick={edit} className={"et-preview " + className}>{content}</div>
            }
            <div id={editorID} className="mb-2" style={{ display: "none" }}>
                <div className="input-group w-md-25 w-sm-50">
                    <input id={inputID} type="text" className="form-control" placeholder={content} />
                    <button onClick={completeSave} className="save-btn btn-outline" type="button" id={saveBtnID}>Save</button>
                    <button onClick={reset} className="cancel-btn btn-outline" type="button" id={cancelBtnID}>Cancel</button>
                </div>
                <div id={savingSpinnerID} className="ms-3 spinner-border" role="status" style={{ display: "none" }}>
                    <span className="visually-hidden">Saving...</span>
                </div>
                <div id={saveResultID} className="ms-3 fs-3" style={{ display: "none" }}></div>
            </div>
        </span>
    );
}
