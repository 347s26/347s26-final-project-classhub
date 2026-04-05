import { CourseInstance, type RawCourseInstance } from "./CourseInstance";

export const API_URL = "http://localhost:8000/api";

export interface RawResponse {
    model: string;
    pk: number;
}

export abstract class Model {
    abstract save(): Promise<boolean>;
}

export async function getCourses(): Promise<CourseInstance[] | null> {
    let raw: RawCourseInstance[] | null = null;
    try
    {
        let req = await fetch(`${API_URL}/courses`);
        raw = (await req.json())["data"];
    }
    catch
    {
        return null;
    }
    if (!raw) return null;
    return raw.map(r => new CourseInstance(r));
}
