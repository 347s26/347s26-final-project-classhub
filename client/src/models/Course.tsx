import { API_URL, Model, type RawResponse } from "./Models";

export interface RawCourse extends RawResponse {
    fields: {
        department_code: string;
        number: number;
        title: string;
    };
}

export class Course extends Model {
    private static CACHE: Map<number, Course> = new Map();

    id: number;
    department_code: string;
    number: number;
    title: string;

    constructor(raw: RawCourse) {
        super();
        this.id = raw.pk;
        this.department_code = raw.fields.department_code;
        this.number = raw.fields.number;
        this.title = raw.fields.title;
    }

    static async from(id: number, ignore_cache = false): Promise<Course | null> {
        const cached = this.CACHE.get(id);
        if (cached && !ignore_cache) return cached;
        let raw: RawCourse | null = null;
        try
        {
            const resp = await fetch(`${API_URL}/course/detail/${id}`);
            if (!resp.ok)
                return null;
            raw = (await resp.json())["data"][0];
        }
        catch
        {
            return null;
        }
        if (!raw) return null;
        const course = new Course(raw);
        this.CACHE.set(id, course);
        return course;
    }

    async save(): Promise<boolean> {
        return false;
    }
}
