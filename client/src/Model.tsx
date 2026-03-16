import { API_URL } from "./Constants";

interface RawResponse {
    model: string;
    pk: number;
}

export interface RawCourse extends RawResponse {
    fields: {
        department_code: string;
        number: number;
        title: string;
    };
}

export class Course {
    department_code: string;
    number: number;
    title: string;

    constructor(raw: RawCourse) {
        this.department_code = raw.fields.department_code;
        this.number = raw.fields.number;
        this.title = raw.fields.title;
    }
}

export interface RawCourseContent extends RawResponse {
    fields: {
        course: number;
        parent: number;
        assignments: number[];
    };
}

export class CourseContent {
    private course_id: number;
    private course: Course | null;
    private parent_id: number;
    private assignment_ids: number[];

    constructor(raw: RawCourseContent) {
        this.course_id = raw.fields.course;
        this.course = null;
        this.parent_id = raw.fields.parent;
        this.assignment_ids = raw.fields.assignments;
    }

    async getCourse(): Promise<Course | null> {
        if (this.course) return this.course;
        let raw: RawCourse | null = null;
        try
        {
            const resp = await fetch(`${API_URL}/course/detail/${this.course_id}`);
            raw = (await resp.json())["result"][0];
        }
        catch
        {
            return null;
        }
        if (!raw) return null;
        return this.course = new Course(raw);
    }
}

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

export class CourseInstance {
    private course_content_id: number;
    private course_content: CourseContent | null;
    semester: Semester;
    year: number;
    section_number: number;
    private instructor_ids: number[]
    // private instructors: Instructor[];

    constructor(raw: RawCourseInstance) {
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

    async getCourseContent(): Promise<CourseContent | null> {
        if (this.course_content) return this.course_content;
        let raw: RawCourseContent | null = null;
        try
        {
            const resp = await fetch(`${API_URL}/course/content/${this.course_content_id}`);
            raw = (await resp.json())["result"][0];
        }
        catch
        {
            return null;
        }
        if (!raw) return null;
        return this.course_content = new CourseContent(raw);
    }
}