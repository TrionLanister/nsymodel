import { renderOpt } from "../../types";
export default class render {
    Renderer: any;
    renderOpt: any;
    constructor(parameters?: renderOpt);
    setSize(width: number, height: number): void;
    clear(): void;
    initRender(opt: renderOpt): void;
}
