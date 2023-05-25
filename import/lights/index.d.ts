import { ambientLi, directionalLi, pointLi, hemisphereLi, spotLi, lightsOpt } from "../../types/index";
export default class lights {
    ambientLight: any;
    directionalLights: any;
    pointLights: any;
    hemisphereLight: any;
    spotLights: any;
    constructor(opt: lightsOpt);
    createAmbient(light: ambientLi): void;
    createDirectional(lights: directionalLi[]): void;
    createPoint(lights: pointLi[]): void;
    createHemisphere(light: hemisphereLi): void;
    createSpot(lights: spotLi[]): void;
}
