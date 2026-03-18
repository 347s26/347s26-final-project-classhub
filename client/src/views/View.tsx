import type { JSX } from "react";

let viewUpdater: React.Dispatch<React.SetStateAction<View>> | null = null;

export function setViewUpdater(updater: React.Dispatch<React.SetStateAction<View>>)
{
    viewUpdater = updater;
}

export abstract class View {
    name: string;
    route: string;
    links: Map<string, () => void>;

    protected constructor(name: string, route: string, links: Map<string, () => void>) {
        this.name = name;
        this.route = route;
        this.links = links;
    }

    abstract render(): Promise<JSX.Element>;

    static redirect(view: View) {
        window.history.replaceState(null, "", view.route);

        if (viewUpdater)
            viewUpdater(view);
    }
}