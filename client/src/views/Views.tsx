import type { NavigateFunction } from "react-router";
import { probe } from "../models/Models";
import * as bootstrap from 'bootstrap';

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

export function toastify(message: string, title: string = "Notification") {
    const toastTitle = document.getElementById("global-toast-title") as HTMLElement;
    const toastContent = document.getElementById("global-toast-content") as HTMLElement;

    const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById("global-toast") as HTMLElement);

    toastTitle.innerText = title;
    toastContent.innerHTML = message;
    toast.show();
}
