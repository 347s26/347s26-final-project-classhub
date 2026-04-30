import { createContext, use, useContext, useEffect, useRef, useState, type JSX } from "react";
import '@popperjs/core';
import * as bootstrap from 'bootstrap';
import "../scss/App.scss";
import type { RelatedObject } from "../models/Models";
import { toastify } from "../views/Views";

type Validator<T> = (value: T) => string | null;

interface FormState {
    id: string;
    fieldProps: Map<string, FieldProps<RelatedObject>>;
    values: Map<string, RelatedObject>;
}

const FormContext = createContext<FormState | null>(null);

export interface FieldProps<T extends RelatedObject> {
    name: string;
    id: string;
    tip: string;
    thing: string;
    default_value?: T;
    validate?: Validator<T>;
    required?: boolean;
}

export interface ShortTextFieldProps<T extends RelatedObject> extends FieldProps<T> {
    placeholder?: string;
    converter?: (x: string) => T | null;
}

export function ShortTextField<T extends RelatedObject>(props: ShortTextFieldProps<T>): JSX.Element {
    const ff = useContext(FormContext) as FormState;
    ff.fieldProps.set(props.id, props as FieldProps<RelatedObject>);

    const { name, id, tip, thing, placeholder, default_value, converter } = props;

    const invalidatorID = `fullform-${ff.id}-${id}-invalidator`;

    function invalidate(message: string) {
        const invalidator = document.getElementById(invalidatorID) as HTMLDivElement;
        invalidator.innerText = message;
    }

    function clearInvalidator() {
        const invalidator = document.getElementById(invalidatorID) as HTMLDivElement;
        invalidator.innerText = "";
    }

    function change(ev: React.ChangeEvent<HTMLInputElement>) {
        clearInvalidator();
        if (converter) {
            const converted = converter(ev.target.value);
            if (!converted) {
                invalidate(`Malformed ${name.toLowerCase()}, expected a ${thing}`);
                ff.values.delete(id);
                return;
            }
            ff.values.set(id, converted);
        }
        ff.values.set(id, ev.target.value);
    }

    return (
        <>
            <FieldTitle title={name} tip={tip} />
            <input type="text" className="form-control" id={id} placeholder={placeholder} value={default_value?.toString()} onChange={change} />
            <div className="form-text mb-4" id={invalidatorID}></div>
        </>
    )
}

function articleAdjective(noun: string) {
    return noun.length === 0 || !"aeiou".includes(noun[0].toLowerCase()) ? "a" : "an";
}

interface FieldTitleProps {
    title: string;
    tip: string;
}

function FieldTitle({ title, tip }: FieldTitleProps) {
    const ref = useRef<HTMLAnchorElement | null>(null);

    useEffect(() => {
        if (!ref.current)
            return;
        new bootstrap.Tooltip(ref.current, {
            title: tip,
            placement: "right",
            trigger: "hover"
        })
        return () => {};
    });

    return (
        <>
            <h2 className="fs-5 mb-3">{title}<i className="info-circle ms-2 bi bi-info-circle" ref={ref}></i></h2>
        </>
    );
}

export interface ObjectSelectorFieldProps extends FieldProps<RelatedObject> {
    searcher: (limit: number, offset: number, query: string) => Promise<RelatedObject[] | null>
}

export function ObjectSelectorField(props: ObjectSelectorFieldProps): JSX.Element {
    const ff = useContext(FormContext) as FormState;
    ff.fieldProps.set(props.id, props);

    const { id, name, tip, thing, searcher } = props;
    let page = 0;

    const modalID = `fullform-${ff.id}-${id}-modal`;
    const resultListID = `fullform-${ff.id}-${id}-result-list`;
    const queryID = `fullform-${ff.id}-${id}-query`;
    const selectionDisplayID = `fullform-${ff.id}-${id}-selection-display`;
    const modalFormID = `fullform-${ff.id}-os-modal-form`;

    async function openDialog() {
        const modalElement = document.getElementById(modalID) as HTMLElement;
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement) as bootstrap.Modal;
        const modalForm = document.getElementById(modalFormID) as HTMLFormElement;
        async function onSubmit(ev: SubmitEvent) {
            ev.preventDefault();
            await search();
        }
        modalForm.addEventListener("submit", onSubmit);
        modalElement.addEventListener("hide.bs.modal", () => modalForm.removeEventListener("submit", onSubmit), { once: true });
        modal.show();
        await search();
    }

    async function search() {
        const resultList = document.getElementById(resultListID) as HTMLUListElement;
        resultList.innerHTML = "";
        const queryElement = document.getElementById(queryID) as HTMLInputElement; 
        if (!searcher) {
            console.error("I don't have a searcher for this object selector");
            return;
        }
        console.log(`searching page ${page}`);
        let results = await searcher(10, page, queryElement.value);
        if (results && results.length === 0)
            results = await searcher(10, page -= 1, queryElement.value);
        if (!results)
            return;
        for (const result of results) {
            if (result.loadAssociatedObjects && !(await result.loadAssociatedObjects())) {
                console.error(`Could load associated objects for object selector entry`);
            }
            const it = document.createElement("button");
            it.type = "button";
            it.classList.add("list-group-item", "list-group-item-action");
            it.innerText = result.toString();
            it.addEventListener("click", () => {
                ff.values.set(id, result);
                const selectionDisplay = document.getElementById(selectionDisplayID) as HTMLInputElement;
                selectionDisplay.value = result.toString();
                const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(modalID) as HTMLElement) as bootstrap.Modal;
                modal.hide();
            });
            resultList.appendChild(it);
        };
    }

    return (
        <>
            <FieldTitle title={name} tip={tip} />
            <div className="input-group mb-4">
                <input id={selectionDisplayID} type="text" className="form-control" placeholder={`Select ${articleAdjective(thing)} ${thing.toLowerCase()}`} disabled />
                <button type="button" className="btn edit-btn" onClick={openDialog}>Search</button>
            </div>
            <div id={modalID} className="modal fade" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{`Select ${articleAdjective(thing)} ${thing.toLowerCase()}`}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">{`Select ${articleAdjective(thing)} ${thing.toLowerCase()} from the list or search for one.`}</div>
                            <div className="input-group mb-3">
                                <input id={queryID} type="text" form={modalFormID} className="form-control" placeholder={`Find ${articleAdjective(thing)} ${thing.toLowerCase()}...`} />
                                <button type="submit" form={modalFormID} className="btn edit-btn">Search</button>
                            </div>
                            <ul id={resultListID} className="list-group mb-3"></ul>
                            <div className="d-flex justify-content-between">
                                <button type="button" className="btn edit-btn" onClick={async () => { page = Math.max(page - 1, 0); await search(); }}>&lt;</button>
                                <button type="button" className="btn edit-btn" onClick={async () => { page = page + 1; await search(); }}>&gt;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export interface EnumSelectorFieldProps extends FieldProps<number> {
    options: Map<string, number>;
}

export function EnumSelectorField(props: EnumSelectorFieldProps) {
    const ff = useContext(FormContext) as FormState;
    ff.fieldProps.set(props.id, props as FieldProps<RelatedObject>);

    const { name, id, tip, thing, options } = props;

    function change(ev: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
        const value = Number(ev.target.value);
        value != -1 ? ff.values.set(id, value) : ff.values.delete(id);
    }

    return (
        <>
            <FieldTitle title={name} tip={tip} />
            <select className="form-select mb-4" onChange={change}>
                <option selected value={-1}>Select {articleAdjective(thing)} {thing.toLowerCase()}</option>
                {Array.from(options).map(([name, oid]) => (
                    <option key={oid} value={oid}>{name}</option>
                ))}
            </select>
        </>
    );
}

export interface FullFormProps extends React.PropsWithChildren {
    id: string;
    title: string;
    submitter: (data: Map<string, RelatedObject>) => Promise<string | null>;
}

export function FullForm(props: FullFormProps) {
    const { id, title, submitter } = props;
    const [fieldProps] = useState(new Map<string, FieldProps<RelatedObject>>());
    const [values] = useState(new Map<string, RelatedObject>());
    const ff: FormState = {
        id: id,
        fieldProps: fieldProps,
        values: values
    };
    async function submit(ev: React.SubmitEvent<HTMLFormElement>) {
        ev.preventDefault();
        for (const [id, fp] of Array.from(fieldProps)) {
            const value = values.get(id);
            if (value === undefined)
            {
                if (fp.required === undefined || fp.required)
                {
                    toastify(`'${fp.name}' is a required field.`, title);
                    return;
                }
                continue;
            }
        }
        const err = await submitter(values);
        if (err)
            toastify(`Submission rejected: ${err}`, title);
    }
    return (
        <div className="d-flex flex-column justify-content-center mx-lg-5">
            <h1 className="mb-4">{title}</h1>
            <FormContext value={ff}>
                <form onSubmit={submit}>
                    {props.children}
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                <form id={`fullform-${id}-os-modal-form`}></form>
            </FormContext>
        </div>
    );
}