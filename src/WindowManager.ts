import * as path from "path";
import { IWindow, IWindowSettings, Window } from "./Window";

export abstract class WindowManager {
    public static create(name: string, layout: string, settings?: IWindowSettings): IWindow {
        if(this.windows.has(name)) {
            return this.windows.get(name);
        }

        const window = new Window(
            path.join(__dirname, "layouts", layout),
            settings,
        );

        this.windows.set(name, window);
        return window;
    }

    private static windows: Map<string, IWindow> = new Map<string, IWindow>();
}
