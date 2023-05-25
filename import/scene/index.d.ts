import { sceneOpt } from "../../types";
export default class scene {
    Scene: any;
    sceneOpt: any;
    pushScene: any;
    _callback: Function;
    constructor(obj: any, parameters: sceneOpt, _callback?: Function);
    initScene(opt?: sceneOpt): void;
    clearScene(): void;
    overScene(scene: any): void;
    overTexture(url: string): Promise<void>;
    getProductById(id: string): any;
    getProductByName(name: string): any;
    getProductByProp(propName: string, value: any): Promise<unknown>;
    setBackground(): Promise<void>;
}
