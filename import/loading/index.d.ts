import { Loading } from "../../types";
export default class loading {
    tween: any;
    parentdDom: any;
    lodOpt: Loading;
    progress: number;
    constructor(parameters: Loading, dom?: any);
    parseDom(arg: string): NodeListOf<ChildNode>;
    createDom(): void;
    showLoading(isReset?: boolean): void;
    hideLoading(isFull?: boolean): void;
    changeProg(pros: number, delay?: number, callback?: Function): void;
}
