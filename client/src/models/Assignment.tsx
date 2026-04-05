import { API_URL, Model, type RawResponse } from "./Models";

export interface RawAssignment extends RawResponse {
    fields: {
        title: string;
        description: string;
        due_date: string | null;
    };
}

export class Assignment extends Model {
    id: number;
    title: string;
    description: string;
    due_date: Date | null;

    constructor(raw: RawAssignment) {
        super();
        this.id = raw.pk;
        this.title = raw.fields.title;
        this.description = raw.fields.description;
        this.due_date = raw.fields.due_date ? new Date(raw.fields.due_date) : null;
    }

    static async from(id: number): Promise<Assignment | null> {
        let raw: RawAssignment | null = null;
        try
        {
            const resp = await fetch(`${API_URL}/assignment/${id}`);
            if (!resp.ok)
                return null;
            raw = (await resp.json())["data"][0];
        }
        catch
        {
            return null;
        }
        if (!raw) return null;
        return new Assignment(raw);
    }

    async save(): Promise<boolean> {
        try
        {
            const resp = await fetch(`${API_URL}/assignment/${this.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    data: [
                        {
                            id: this.id,
                            title: this.title,
                            description: this.description,
                            due_date: this.due_date?.toISOString()
                        }
                    ]
                })
            });
            if (!resp.ok)
                return false;
        }
        catch
        {
            return false;
        }
        return true;
    }
}
