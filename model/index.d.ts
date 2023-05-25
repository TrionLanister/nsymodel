import { modelsOpt } from "../types";
export default class nsyModels {
    allOpt: Array<modelsOpt>;
    models: any;
    modelLen: number;
    dracoLoader: any;
    process: number;
    constructor(opt: Array<modelsOpt>);
    loadGltf: () => Promise<any[]>;
    foreachMesh(models: any, opt: any): Promise<any>;
}
