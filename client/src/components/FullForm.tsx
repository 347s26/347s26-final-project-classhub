import { useState, type JSX } from "react";

export interface BaseField {
    id: string;
    name: string;
    required: boolean;
}

export interface ShortTextField extends BaseField {
    type: "shorttext";
    placeholder?: string;
    default_content?: string;
    validate?: (value: string) => string | null; 
}

export interface ObjectSelectorField extends BaseField {
    type: "objectselector";
    placeholder?: any;
    default_content?: any;
    validate?: (value: any) => string | null;
}

export type Field = ShortTextField | ObjectSelectorField;

export interface FullFormProps {
    id: string;
    title: string;
    fields: Map<string, Field>;
    submit: (data: Map<string, any>) => void;
}

function renderShortText(field: ShortTextField): JSX.Element {
    return <input type="text" className="form-control" id={field.id} placeholder={field.placeholder} value={field.default_content} />
}

function renderObjectSelector(field: ObjectSelectorField): JSX.Element {
    return (
        <>
            <select className="form-select">
                <option selected>{field.default_content ?? "-"}</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
        </>
    )
}

function renderDispatch(field: Field): JSX.Element {
    switch (field.type) {
        case "shorttext":
            return renderShortText(field as ShortTextField);
        case "objectselector":
            return renderObjectSelector(field as ObjectSelectorField);
    }
}

function validateDispatch(field: Field, value: any): string | null {
    return field.validate ? field.validate(value) : null;
}

export function FullForm({ id, title, fields, submit }: FullFormProps) {
    const [values, _] = useState(new Map<string, any>());
    const ffid = id;
    return (
        <div className="d-flex flex-column justify-content-center mx-lg-5">
            <h1 className="mb-4">{title}</h1>
            <form>
                {Array.from(fields).map(([id, field]) => (
                    <div className="mb-3">
                        <label htmlFor={`fullform-${ffid}-${id}`} className="form-label">{field.name}</label>
                        {renderDispatch(field)}
                    </div>
                ))}
                <button type="submit" className="btn btn-primary" onClick={() => submit(values)}>Submit</button>
            </form>
        </div>
    );
}