import { Assignment, type RawAssignment } from "./Assignment";
import { Course } from "./Course";
import { API_URL, Model, type RawResponse } from "./Models";

export interface RawCourseContent extends RawResponse {
    fields: {
        course: number;
        parent: number;
        overview: string;
        syllabus: string;
        assignments: number[];
    };
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

    getCourseSync(): Course | null {
        return this.course;
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

    getAssignmentsSync() {
        return this.assignments; 
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

    async save(): Promise<boolean> {
        try
        {
            const resp = await fetch(`${API_URL}/course/content/${this.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    data: [
                        {
                            course_id: this.course_id,
                            parent_id: this.parent_id,
                            assignment_ids: this.assignment_ids,
                            overview: this.overview,
                            syllabus: this.syllabus
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
