import type { Course } from "./Course";
import { CourseContent } from "./CourseContent";
import { API_URL, Model, type RawResponse } from "./Models";

export interface RawCourseInstance extends RawResponse {
    fields: {
        course_content: number;
        semester: number;
        year: number;
        section_number: number;
        instructors: number[];
    };
}

export enum Semester {
    Winter = 0,
    Spring = 1,
    Summer = 2,
    Fall = 3
}

export class CourseInstance extends Model {
    static CACHE: Map<number, CourseInstance> = new Map();

    id: number;
    private course_content_id: number;
    private course_content: CourseContent | null;
    semester: Semester;
    year: number;
    section_number: number;
    private instructor_ids: number[];
    // private instructors: Instructor[];

    constructor(raw: RawCourseInstance) {
        super();
        this.id = raw.pk;
        this.course_content_id = raw.fields.course_content;
        this.course_content = null;
        this.semester = raw.fields.semester;
        this.year = raw.fields.year;
        this.section_number = raw.fields.section_number;
        this.instructor_ids = raw.fields.instructors;
    }

    async getCourse(): Promise<Course | null> {
        const content = await this.getCourseContent();
        if (!content) return null;
        const course = await content.getCourse();
        return course;
    }

    getCourseSync(): Course | null {
        return this.course_content ? this.course_content.getCourseSync() : null;
    }

    async getCourseContent(): Promise<CourseContent | null> {
        return this.course_content ?? (this.course_content = await CourseContent.from(this.course_content_id));
    }

    getCourseContentSync(): CourseContent | null {
        return this.course_content;
    }

    static async from(id: number, ignore_cache = false): Promise<CourseInstance | null> {
        const cached = this.CACHE.get(id);
        if (cached && !ignore_cache) { console.log(`got ${id} from cache`); return cached; }
        let raw: RawCourseInstance | null = null;
        try
        {
            const resp = await fetch(`${API_URL}/course/${id}`);
            if (!resp.ok)
                return null;
            raw = (await resp.json())["data"][0];
        }
        catch
        {
            return null;
        }
        if (!raw) return null;
        const instance = new CourseInstance(raw);
        this.CACHE.set(id, instance);
        return instance;
    }

    static async make(course_content_id: number, semester: Semester, year: number, section_number: number): Promise<CourseInstance | null> {
        const resp = await fetch(`${API_URL}/course`, {
            method: "POST",
            body: JSON.stringify({
                course_content: course_content_id,
                semester: semester,
                year: year,
                section_number: section_number 
            })
        });

        if (!resp.ok)
            return null;

        const instance = new CourseInstance((await resp.json())["data"][0] as RawCourseInstance);
        this.CACHE.set(instance.id, instance);
        return instance;
    }

    async delete(): Promise<boolean> {
        const resp = await fetch(`${API_URL}/course/${this.id}`, {
            method: "DELETE"
        });

        return resp.ok;
    }

    async save(): Promise<boolean> {
        return false;
    }
}
