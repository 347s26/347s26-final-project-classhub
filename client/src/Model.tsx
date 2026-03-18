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

abstract class Model {
    abstract save(): Promise<boolean>;
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

export interface RawCourseContent extends RawResponse {
    fields: {
        course: number;
        parent: number;
        overview: string;
        syllabus: string;
        assignments: number[];
    };
}

interface UploadCourseContent {
    data: [
        {
            course_id: number | null;
            parent_id: number | null;
            assignment_ids: number[] | null;
            overview: string | null;
            syllabus: string | null;
        }
    ];
}

export class CourseContent extends Model {
    id: number;
    private course_id: number;
    private course: Course | null;
    private parent_id: number;
    private assignment_ids: number[];
    private assignments: Assignment[] | null;
    overview: string;
    syllabus: string;

    constructor(raw: RawCourseContent) {
        super();
        this.id = raw.pk;
        this.course_id = raw.fields.course;
        this.course = null;
        this.parent_id = raw.fields.parent;
        this.assignment_ids = raw.fields.assignments;
        this.overview = raw.fields.overview;
        this.syllabus = raw.fields.syllabus;
        this.assignments = null;
    }

    async getCourse(): Promise<Course | null> {
        return this.course ?? (this.course = await Course.from(this.course_id));
    }

    async getAssignments(): Promise<Assignment[] | null> {
        if (this.assignments) return this.assignments;
        let raw: RawAssignment[] | null = null;
        try
        {
            const resp = await fetch(`${API_URL}/course/content/${this.id}/assignments`);
            if (!resp.ok)
                return null;
            raw = (await resp.json())["data"];
        }
        catch
        {
            return null;
        }
        if (!raw) return null;
        return this.assignments = raw.map(r => new Assignment(r));
    }

    static async from(id: number): Promise<CourseContent | null> {
        let raw: RawCourseContent | null = null;
        try
        {
            const resp = await fetch(`${API_URL}/course/content/${id}`);
            if (!resp.ok)
                return null;
            raw = (await resp.json())["data"][0];
        }
        catch
        {
            return null;
        }
        if (!raw) return null;
        return new CourseContent(raw);
    }

    protected asUpload(): BodyInit {
        const upload = {
            data: [
                {
                    course_id: this.course_id,
                    parent_id: this.parent_id,
                    assignment_ids: this.assignment_ids,
                    overview: this.overview,
                    syllabus: this.syllabus
                }
            ]
        } as UploadCourseContent;
        return JSON.stringify(upload);
    }

    async save(): Promise<boolean> {
        try
        {
            const resp = await fetch(`${API_URL}/course/content/${this.id}`, {
                method: "PUT",
                body: this.asUpload()
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
        return false;
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

export class CourseInstance extends Model {
    static CACHE: Map<number, CourseInstance> = new Map();

    id: number;
    private course_content_id: number;
    private course_content: CourseContent | null;
    semester: Semester;
    year: number;
    section_number: number;
    private instructor_ids: number[]
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

    async getCourseContent(): Promise<CourseContent | null> {
        return this.course_content ?? (this.course_content = await CourseContent.from(this.course_content_id));
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

    async save(): Promise<boolean> {
        return false;
    }
}