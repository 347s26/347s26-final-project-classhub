import type { JSX } from "react";
import { View } from "./View";

export class ErrorView extends View {
    message: string;

    constructor(message: string) {
        super("Error", "/error", new Map());
        this.message = message;
    }

    async render(): Promise<JSX.Element> {
        return (
            <>
                <h2>Error</h2>
                <div>{this.message}</div>
            </>
        );
    }
}