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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const EXRLoader_1 = require("three/examples/jsm/loaders/EXRLoader"); //exr加载器
const THREE = __importStar(require("three"));
const indexDB_1 = __importDefault(require("../../indexDB"));
const setting_1 = require("../../setting");
class scene {
    constructor(obj, parameters, _callback) {
        this._callback = () => { };
        this.Scene = obj;
        this.sceneOpt = parameters;
        this.initScene(parameters);
        _callback && (this._callback = _callback);
    }
    initScene(opt) {
        // this.sceneOpt.color = formatColor(opt?.background);
        this.Scene.environment = (opt === null || opt === void 0 ? void 0 : opt.environment) || null;
        this.Scene.castShadow = (opt === null || opt === void 0 ? void 0 : opt.castShadow) || false;
        // this.Scene.background = formatColor(opt?.background) || null;
        this.pushScene = (obj) => {
            this.Scene.add(obj);
        };
        this.setBackground();
    }
    clearScene() {
        this.Scene = new THREE.Scene();
    }
    overScene(scene) {
        this.clearScene();
        this.Scene = scene;
    }
    overTexture(url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(this.Scene);
            this.sceneOpt.background = url;
            if (this.sceneOpt.backgroundType === 'cube') {
                let childs = this.Scene.children;
                for (let i = 0; i < childs.length; i++) {
                    if (childs[i].name === 'skybox') {
                        let path = this.sceneOpt.background; //设置路径
                        let directions = ["px", "nx", "py", "ny", "pz", "nz"]; //获取对象
                        let format = this.sceneOpt.format || '.jpg';
                        let skyboxCubemap = yield new THREE.CubeTextureLoader().loadAsync([
                            path + directions[0] + format,
                            path + directions[1] + format,
                            path + directions[2] + format,
                            path + directions[3] + format,
                            path + directions[4] + format,
                            path + directions[5] + format
                        ]);
                        (yield skyboxCubemap).format = THREE.RGBAFormat;
                        let skyboxShader = THREE.ShaderLib['cube'];
                        skyboxShader.uniforms['tCube'].value = skyboxCubemap;
                        childs[i].material = new THREE.ShaderMaterial({
                            fragmentShader: skyboxShader.fragmentShader,
                            vertexShader: skyboxShader.vertexShader,
                            uniforms: skyboxShader.uniforms,
                            depthWrite: false,
                            side: THREE.BackSide //正反面
                        });
                        this.Scene.environment = ((_a = this.sceneOpt) === null || _a === void 0 ? void 0 : _a.environment) ? skyboxCubemap : null;
                    }
                }
            }
        });
    }
    getProductById(id) {
        return this.Scene.getObjectById(id);
    }
    getProductByName(name) {
        return this.Scene.getObjectByName(name);
    }
    getProductByProp(propName, value) {
        return new Promise((resolve, reject) => {
            this.Scene.traverse((mesh) => {
                if (mesh.userData[`${propName}`] && mesh.userData[`${propName}`] === value) {
                    resolve(mesh);
                }
            });
        });
    }
    setBackground() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sceneOpt.backgroundType === 'color') {
                this.Scene.environment = ((_a = this.sceneOpt) === null || _a === void 0 ? void 0 : _a.environment) || null;
                this.Scene.background = (0, utils_1.formatColor)((_b = this.sceneOpt) === null || _b === void 0 ? void 0 : _b.background) || null;
                return;
            }
            if (this.sceneOpt.backgroundType === 'exr') {
                const dbs = yield indexDB_1.default.openDB(setting_1.database.dbName, setting_1.database.modelTable, setting_1.database.versition);
                let data = null;
                // 加载exr环境图
                const exrLoader = new EXRLoader_1.EXRLoader();
                let map;
                if (this.sceneOpt.dataBase) {
                    data = yield indexDB_1.default.getDataByKey(dbs, setting_1.database.modelTable, (_c = this.sceneOpt.dataBase) === null || _c === void 0 ? void 0 : _c.id);
                }
                else {
                    data = null;
                }
                const doData = (type) => __awaiter(this, void 0, void 0, function* () {
                    var _g, _h, _j, _k, _l, _m;
                    yield (0, utils_1.httpGet)(this.sceneOpt.background, { responseType: 'arraybuffer' }).then((res) => __awaiter(this, void 0, void 0, function* () {
                        map = res;
                    }));
                    if (this.sceneOpt.dataBase) {
                        switch (type) {
                            case 'add':
                                yield indexDB_1.default.addData(dbs, setting_1.database.modelTable, {
                                    id: (_g = this.sceneOpt.dataBase) === null || _g === void 0 ? void 0 : _g.id,
                                    name: (_h = this.sceneOpt.dataBase) === null || _h === void 0 ? void 0 : _h.name,
                                    version: (_j = this.sceneOpt.dataBase) === null || _j === void 0 ? void 0 : _j.version,
                                    img: map
                                });
                                break;
                            case 'update':
                                yield indexDB_1.default.updateDB(dbs, setting_1.database.modelTable, {
                                    id: (_k = this.sceneOpt.dataBase) === null || _k === void 0 ? void 0 : _k.id,
                                    name: (_l = this.sceneOpt.dataBase) === null || _l === void 0 ? void 0 : _l.name,
                                    version: (_m = this.sceneOpt.dataBase) === null || _m === void 0 ? void 0 : _m.version,
                                    img: map
                                });
                                break;
                            default:
                                break;
                        }
                    }
                });
                if (!data) {
                    yield doData('add');
                }
                else {
                    if (data.version !== ((_d = this.sceneOpt.dataBase) === null || _d === void 0 ? void 0 : _d.version)) {
                        yield doData('update');
                    }
                    else {
                        map = data.img;
                    }
                }
                map = exrLoader.parse(map);
                let texture = new THREE.DataTexture(map.data, map.width, map.height, THREE.RGBAFormat, map.type);
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.needsUpdate = true; //纹理更新
                this.Scene.background = texture;
                this.Scene.environment = ((_e = this.sceneOpt) === null || _e === void 0 ? void 0 : _e.environment) ? texture : null;
                this._callback();
            }
            if (this.sceneOpt.backgroundType === 'cube') {
                let path = this.sceneOpt.background; //设置路径
                let directions = ["px", "nx", "py", "ny", "pz", "nz"]; //获取对象
                let format = this.sceneOpt.format || '.jpg';
                let skyboxCubemap = yield new THREE.CubeTextureLoader().loadAsync([
                    path + directions[0] + format,
                    path + directions[1] + format,
                    path + directions[2] + format,
                    path + directions[3] + format,
                    path + directions[4] + format,
                    path + directions[5] + format
                ]);
                (yield skyboxCubemap).format = THREE.RGBAFormat;
                skyboxCubemap.encoding = THREE.sRGBEncoding;
                let skyboxShader = THREE.ShaderLib['cube'];
                skyboxShader.uniforms['tCube'].value = skyboxCubemap;
                let skyBox = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 200), new THREE.ShaderMaterial({
                    fragmentShader: skyboxShader.fragmentShader,
                    vertexShader: skyboxShader.vertexShader,
                    uniforms: skyboxShader.uniforms,
                    depthWrite: true,
                    side: THREE.DoubleSide //正反面
                }));
                skyBox.name = 'skybox';
                this.Scene.background = skyboxCubemap;
                this.Scene.environment = ((_f = this.sceneOpt) === null || _f === void 0 ? void 0 : _f.environment) ? skyboxCubemap : null;
                this.Scene.add(skyBox);
                this._callback();
            }
        });
    }
}
exports.default = scene;
