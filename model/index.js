"use strict";
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
const three_1 = require("three");
const DRACOLoader_1 = require("three/examples/jsm/loaders/DRACOLoader");
const GLTFLoader_1 = require("three/examples/jsm/loaders/GLTFLoader");
const utils_1 = require("../utils");
const indexDB_1 = __importDefault(require("../indexDB"));
const setting_1 = require("../setting");
class nsyModels {
    constructor(opt) {
        this.models = [];
        this.loadGltf = () => __awaiter(this, void 0, void 0, function* () {
            let promises = [];
            const gltfLoader = new GLTFLoader_1.GLTFLoader();
            const objLoader = new three_1.ObjectLoader();
            const _this = this;
            const dbs = yield indexDB_1.default.openDB(setting_1.database.dbName, setting_1.database.modelTable, setting_1.database.versition);
            const loadGltf = (opt) => __awaiter(this, void 0, void 0, function* () {
                if (!_this.dracoLoader && opt.draco) {
                    _this.dracoLoader = new DRACOLoader_1.DRACOLoader();
                    _this.dracoLoader.setDecoderPath(opt.loaderUrl || 'nsyModel/model/draco/gltf/');
                    _this.dracoLoader.setDecoderConfig({
                        type: 'js'
                    });
                    _this.dracoLoader.preload();
                }
                if (opt.draco)
                    gltfLoader.setDRACOLoader(_this.dracoLoader);
                return yield gltfLoader.loadAsync(opt.url, (xhr) => {
                    _this.process = (xhr.loaded / xhr.total) / _this.modelLen * 100;
                });
            });
            const loads = (opt) => __awaiter(this, void 0, void 0, function* () {
                let mod = null;
                if (opt.modelType == 'glb' || opt.modelType == 'gltf') { //判断是否为glb或者gltf格式的模型
                    yield loadGltf(opt).then((gltf) => {
                        _this.foreachMesh(gltf, opt).then(model => {
                            mod = model.scene.children[0];
                        });
                    });
                }
                else if (opt.modelType == 'json') {
                    yield (0, utils_1.httpGet)(opt.url, { responseType: "json" }).then((res) => {
                        mod = objLoader.parse(res);
                    });
                }
                return mod;
            });
            for (let i = 0; i < _this.allOpt.length; i++) {
                let opt = _this.allOpt[i];
                let data = null, model = null;
                const doData = (type, data) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e, _f;
                    if (opt.dataBase) {
                        switch (type) {
                            case 'add':
                                yield indexDB_1.default.addData(dbs, setting_1.database.modelTable, {
                                    id: (_a = opt.dataBase) === null || _a === void 0 ? void 0 : _a.id,
                                    name: (_b = opt.dataBase) === null || _b === void 0 ? void 0 : _b.name,
                                    version: (_c = opt.dataBase) === null || _c === void 0 ? void 0 : _c.version,
                                    model: data
                                });
                                break;
                            case 'update':
                                yield indexDB_1.default.updateDB(dbs, setting_1.database.modelTable, {
                                    id: (_d = opt.dataBase) === null || _d === void 0 ? void 0 : _d.id,
                                    name: (_e = opt.dataBase) === null || _e === void 0 ? void 0 : _e.name,
                                    version: (_f = opt.dataBase) === null || _f === void 0 ? void 0 : _f.version,
                                    model: data
                                });
                                break;
                            default:
                                break;
                        }
                    }
                });
                let pros = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var _g, _h;
                    if (opt.dataBase) { // 存在indexdb数据库的配置
                        data = yield indexDB_1.default.getDataByKey(dbs, setting_1.database.modelTable, (_g = opt.dataBase) === null || _g === void 0 ? void 0 : _g.id); // 则打开数据并且根据ID查询
                        if (!data) { // 如果从indexdb中没查到对应数据
                            model = yield loads(opt);
                            model.name = opt.dataBase.name;
                            yield doData('add', model.toJSON()); //则新增
                        }
                        else { // 查到了
                            if (data.version !== ((_h = opt.dataBase) === null || _h === void 0 ? void 0 : _h.version)) { //就去判断模型版本号对不对
                                model = yield loads(opt);
                                model.name = opt.dataBase.name;
                                yield doData('update', model.toJSON()); // 版本号不对修改数据库模型
                            }
                            else { // 版本号正确则直接使用
                                model = objLoader.parse(data.model);
                            }
                        }
                    }
                    opt.CameraPosition && (model.userData.CameraPosition = opt.CameraPosition);
                    opt.TargetPosition && (model.userData.TargetPosition = opt.TargetPosition);
                    _this.models.push(model);
                    opt.onLoaded && opt.onLoaded(model, opt);
                    resolve(Object.assign(Object.assign({}, opt), { model: model }));
                }));
                promises.push(pros);
            }
            return Promise.all(promises);
        });
        this.process = 0;
        this.modelLen = opt.length;
        this.allOpt = opt;
    }
    foreachMesh(models, opt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (opt.globalMember || opt.specilMember) {
                models.scene.traverse((mesh) => {
                    if (opt.globalMember) {
                        if (mesh.isMesh) {
                            mesh.frustumCulled = false;
                            //模型阴影
                            mesh.castShadow = true;
                            mesh.castShadow = opt.globalMember.castShadow || false;
                            mesh.receiveShadow = opt.globalMember.castShadow || false;
                            mesh.material.emissive ? (mesh.material.emissive = mesh.material.color) : '';
                            mesh.material.emissiveMap = mesh.material.map;
                        }
                    }
                });
            }
            return models;
        });
    }
}
exports.default = nsyModels;
