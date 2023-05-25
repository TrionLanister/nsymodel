/*
 * @Description: 
 * @Version: 2.0
 * @Autor: CHENlm
 * @Date: 2023-03-24 20:06:18
 * @LastEditors: ChenLinMao
 * @LastEditTime: 2023-05-24 15:50:47
 */
import * as THREE from "three"; //引入Threejs
import { Loader, Object3D, ObjectLoader } from "three";
import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { modelsOpt } from "../types"
import { httpGet } from "../utils";
import IndexDB from "../indexDB"
import { database } from "../setting"
export default class nsyModels {
    allOpt: Array<modelsOpt>;
    models: any = [];
    modelLen: number;
    dracoLoader: any;
    process: number;
    constructor(opt: Array<modelsOpt>) {
        this.process = 0;
        this.modelLen = opt.length;
        this.allOpt = opt;
    }

    loadGltf = async () => {
        let promises: Array<Promise<any>> = [];
        const gltfLoader = new GLTFLoader();
        const objLoader = new ObjectLoader();
        const _this = this;
        const dbs = await IndexDB.openDB(database.dbName, database.modelTable, database.versition);
        const loadGltf = async (opt: any) => {
            if (!_this.dracoLoader && opt.draco) {
                _this.dracoLoader = new DRACOLoader();
                _this.dracoLoader.setDecoderPath(opt.loaderUrl || 'nsyModel/model/draco/gltf/');
                _this.dracoLoader.setDecoderConfig({
                    type: 'js'
                })
                _this.dracoLoader.preload();
            }
            if (opt.draco) gltfLoader.setDRACOLoader(_this.dracoLoader)
            return await gltfLoader.loadAsync(opt.url, (xhr) => {
                _this.process = (xhr.loaded / xhr.total) / _this.modelLen * 100;
            })
        }
        const loads = async (opt: any) => {
            let mod: any = null;
            if (opt.modelType == 'glb' || opt.modelType == 'gltf') {//判断是否为glb或者gltf格式的模型
                await loadGltf(opt).then((gltf: any) => {
                    _this.foreachMesh(gltf, opt).then(model => {
                        mod = model.scene.children[0]
                    });
                });
            } else if (opt.modelType == 'json') {
                await httpGet(opt.url, { responseType: "json" }).then((res: any) => {
                    mod = objLoader.parse(res);
                })
            }
            return mod;
        }
        for (let i = 0; i < _this.allOpt.length; i++) {
            let opt: modelsOpt = _this.allOpt[i];
            let data: any = null, model: any = null;
            const doData = async (type: 'add' | 'update', data: string) => {
                if (opt.dataBase) {
                    switch (type) {
                        case 'add':
                            await IndexDB.addData(dbs, database.modelTable, {
                                id: opt.dataBase?.id, // 必须且值唯一
                                name: opt.dataBase?.name,
                                version: opt.dataBase?.version,
                                model: data
                            })
                            break;
                        case 'update':
                            await IndexDB.updateDB(dbs, database.modelTable, {
                                id: opt.dataBase?.id, // 必须且值唯一
                                name: opt.dataBase?.name,
                                version: opt.dataBase?.version,
                                model: data
                            })
                            break;
                        default:
                            break;
                    }
                }
            }
            let pros = new Promise(async (resolve, reject) => {
                if (opt.dataBase) { // 存在indexdb数据库的配置
                    data = await IndexDB.getDataByKey(dbs, database.modelTable, opt.dataBase?.id); // 则打开数据并且根据ID查询
                    if (!data) {// 如果从indexdb中没查到对应数据
                        model = await loads(opt);
                        model.name = opt.dataBase.name;
                        await doData('add', model.toJSON());//则新增
                    } else {// 查到了
                        if (data.version !== opt.dataBase?.version) {//就去判断模型版本号对不对
                            model = await loads(opt);
                            model.name = opt.dataBase.name
                            await doData('update', model.toJSON())// 版本号不对修改数据库模型
                        } else {// 版本号正确则直接使用
                            model = objLoader.parse(data.model)
                        }
                    }
                }
                opt.CameraPosition && (model.userData.CameraPosition = opt.CameraPosition);
                opt.TargetPosition && (model.userData.TargetPosition = opt.TargetPosition);
                _this.models.push(model);
                opt.onLoaded && opt.onLoaded(model, opt);
                resolve({ ...opt, model: model });
            })
            promises.push(pros);
        }
        return Promise.all(promises);
    }
    async foreachMesh(models: any, opt: any) {
        if (opt.globalMember || opt.specilMember) {
            models.scene.traverse((mesh: any) => {
                if (opt.globalMember) {
                    if (mesh.isMesh) {
                        mesh.frustumCulled = false;
                        //模型阴影
                        mesh.castShadow = true;
                        mesh.castShadow = opt.globalMember.castShadow || false;
                        mesh.receiveShadow = opt.globalMember.castShadow || false;
                        mesh.material.emissive?(mesh.material.emissive = mesh.material.color):'';
                        mesh.material.emissiveMap = mesh.material.map;
                    }
                }
            })
        }
        return models;
    }
}