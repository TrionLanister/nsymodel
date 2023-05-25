import { controlOpt } from "../../types";
import { Camera, Vector3 } from "three";
export default class control {
    Control: any;
    conOpt: controlOpt;
    constructor(camera: Camera, ele: HTMLElement, opt?: controlOpt);
    setProp(): void;
    setTarget(position: Vector3): void;
    getTarget(): any;
    onChange(): void;
    onStart(): void;
    onEnd(): void;
}
