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
exports.water = void 0;
const THREE = __importStar(require("three"));
const Water_js_1 = require("three/examples/jsm/objects/Water.js");
const index_1 = require("../../utils/index");
const water = (option) => {
    let defaultOption = {
        textureWidth: 512,
        textureHeight: 512,
        alpha: 0.7,
        sunColor: (0, index_1.formatColor)('#fff'),
        waterColor: (0, index_1.formatColor)('#1484e7'),
        distortionScale: 2,
        waterNormalsUrl: 'nsymodel/import/waterFace/waternormals.jpg',
        position: { x: 0, y: 0, z: 0 },
        size: {
            width: 10,
            height: 10
        }
    };
    defaultOption = Object.assign({}, option);
    let setting = Object.assign(Object.assign({}, defaultOption), { waterNormals: new THREE.TextureLoader().load(defaultOption.waterNormalsUrl, (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }) });
    let geometry = new THREE.PlaneGeometry(setting.size.width, setting.size.height);
    let water = new Water_js_1.Water(geometry, setting);
    if (setting.position) {
        water.position.set(setting.position.x, setting.position.y, setting.position.z);
    }
    water.rotation.x = -Math.PI / 2;
    return water;
};
exports.water = water;
