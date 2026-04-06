import { FullForm, type Field, type ShortTextField } from "../components/FullForm";

export function CourseCreatorView() {
    const fields = new Map<string, Field>([
        ["name", {
            name: "Name",
            type: "shorttext"
        } as ShortTextField]
    ]);
    function submit(data: Map<string, any>) {

    }
    return <FullForm id="create-course" title="Create Course" fields={fields} submit={submit} />
}
