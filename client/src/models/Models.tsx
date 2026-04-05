import { CourseInstance, type RawCourseInstance } from "./CourseInstance";

export const SERVER_URL = "http://localhost:8000";
export const API_URL = `${SERVER_URL}/api`;

export interface AllAuthError {
    message: string,
    code: string,
    param: string
}

export interface RawResponse {
    model: string;
    pk: number;
}

export abstract class Model {
    abstract save(): Promise<boolean>;
}

export async function getCourses(): Promise<CourseInstance[] | null> {
    const token = localStorage.getItem("session");
    if (!token)
        return null;
    let raw: RawCourseInstance[] | null = null;
    try
    {
        let req = await fetch(`${API_URL}/courses`, {
            method: "GET",
            headers: {
                "X-Session-Token": token
            }
        });
        raw = (await req.json())["data"];
    }
    catch
    {
        return null;
    }
    if (!raw) return null;
    return raw.map(r => new CourseInstance(r));
}

interface SignupResponse {
    status: number;
    data: {
        user: {};
        methods: [];
    };
    meta: {
        session_token: string;
        access_token: string;
        is_authenticated: boolean;
    };
};

interface SignupError {
    status: number;
    errors: AllAuthError[];
}

export interface LoginResult {
    token: string | null;
    errors: AllAuthError[];
}

export async function signup(emailAddress: string, password: string): Promise<LoginResult> {
    const req = await fetch(`${SERVER_URL}/_allauth/app/v1/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
            email: emailAddress,
            password: password
        })
    });
    return processLogin(req);
}

export async function login(emailAddress: string, password: string): Promise<LoginResult> {
    const req = await fetch(`${SERVER_URL}/_allauth/app/v1/auth/login`, {
        method: "POST",
        body: JSON.stringify({
            email: emailAddress,
            password: password
        })
    });
    return processLogin(req);
}

async function processLogin(req: Response): Promise<LoginResult> {
    if (!req.ok) {
        try {
            const resp = await req.json() as SignupError;
            return {
                token: null,
                errors: resp.errors
            } as LoginResult;   
        } catch {
            return {
                token: null,
                errors: [{
                    message: "Server refused request"
                }]
            } as LoginResult;
        }
    }
    const resp = await req.json() as SignupResponse;
    if (!resp.meta.is_authenticated) {
        return {
            token: null,
            errors: [{
                message: "Failed to authenticate"
            }]
        } as LoginResult;
    }
    return {
        token: resp.meta.session_token,
        errors: []
    } as LoginResult;
}

export async function probe(token: string): Promise<boolean> {
    const req = await fetch(`${SERVER_URL}/_allauth/app/v1/auth/session`, {
        method: "GET",
        headers: {
            "X-Session-Token": token
        }
    });
    return req.ok;
}
