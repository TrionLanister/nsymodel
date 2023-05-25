import { cameraOpt } from "../../types";
export default class camera {
    Camera: any;
    cameraOpt: cameraOpt;
    constructor(obj: any, parameters?: cameraOpt);
    sizeChange(width: number, height: number): void;
    setPos(pos?: any): void;
    getPos(): any;
    setTar(pos?: any): void;
    getTar(): any;
}
