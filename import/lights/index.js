"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = __importStar(require("three"));
const utils_1 = require("../../utils");
class lights {
    constructor(opt) {
        this.directionalLights = []; //平行光
        this.pointLights = []; //点光源
        this.spotLights = []; //聚光灯
        // const ST = new nsyAuth().authLights(opt)
        // if (ST !== 'success') {
        //     alert(ST);
        //     return;
        // }
        if (opt.ambientLight)
            this.createAmbient(opt.ambientLight);
        if (opt.directionalLights)
            this.createDirectional(opt.directionalLights);
        if (opt.pointLights)
            this.createPoint(opt.pointLights);
        if (opt.hemisphereLight)
            this.createHemisphere(opt.hemisphereLight);
        if (opt.spotLights)
            this.createSpot(opt.spotLights);
    }
    createAmbient(light) {
        this.ambientLight = new THREE.AmbientLight((0, utils_1.formatColor)(light.color), light.intensity);
    }
    createDirectional(lights) {
        for (let i = 0; i < lights.length; i++) {
            let item = lights[i];
            let direct = new THREE.DirectionalLight((0, utils_1.formatColor)(item.color), item.intensity); //光源设置
            if (item.position)
                direct.position.set(item.position.x, item.position.y, item.position.z);
            item.castShadow && (direct.castShadow = item.castShadow);
            this.directionalLights.push(direct);
        }
    }
    createPoint(lights) {
        for (let i = 0; i < lights.length; i++) {
            let item = lights[i];
            let point = new THREE.PointLight((0, utils_1.formatColor)(item.color), item.intensity, item.distance, item.decay); //光源设置
            if (item.position)
                point.position.set(item.position.x, item.position.y, item.position.z);
            item.castShadow && (point.castShadow = item.castShadow);
            this.pointLights.push(point);
        }
    }
    createHemisphere(light) {
        this.hemisphereLight = new THREE.HemisphereLight((0, utils_1.formatColor)(light.skyColor), (0, utils_1.formatColor)(light.groundColor), light.intensity);
        if (light.position)
            this.hemisphereLight.position.set(light.position.x, light.position.y, light.position.z);
    }
    createSpot(lights) {
        for (let i = 0; i < lights.length; i++) {
            let item = lights[i];
            let spot = new THREE.SpotLight((0, utils_1.formatColor)(item.color), item.intensity, item.distance, item.angle, item.penumbra, item.decay); //光源设置
            if (item.position)
                spot.position.set(item.position.x, item.position.y, item.position.z);
            item.castShadow && (spot.castShadow = item.castShadow);
            this.spotLights.push(spot);
        }
    }
}
exports.default = lights;
