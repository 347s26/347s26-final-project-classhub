import type { NavigateFunction } from "react-router";
import { probe } from "../models/Models";

export function probeEffect(navigate: NavigateFunction) {
    return () => {
        async function _() {
            const token = localStorage.getItem("session");
            if (!token)
                navigate("/login");
            else if (!(await probe(token)))
                navigate("/login");
        }
        _();
        return () => {};
    }
}
