import type { JSX } from "react";

export abstract class View {
    name: string;

    protected constructor(name: string) {
        this.name = name;
    }

    abstract render(): Promise<JSX.Element>;
}