/*
 * @Description: 
 * @Version: 2.0
 * @Autor: CHENlm
 * @Date: 2023-03-24 19:02:17
 * @LastEditors: ChenLinMao
 * @LastEditTime: 2023-05-05 10:15:04
 */
import { sceneOpt } from "../../types"
import { formatColor, httpGet } from "../../utils";
import {
    EXRLoader
} from "three/examples/jsm/loaders/EXRLoader"; //exr加载器
import * as THREE from "three";
import IndexDB from "../../indexDB"
import { database } from "../../setting"
import { Mesh } from "three";
export default class scene {
    Scene;
    sceneOpt;
    pushScene: any;
    _callback: Function = () => { };
    constructor(obj: any, parameters: sceneOpt, _callback?: Function) {
        this.Scene = obj;
        this.sceneOpt = parameters;
        this.initScene(parameters);
        _callback && (this._callback = _callback)
    }
    initScene(opt?: sceneOpt) {
        // this.sceneOpt.color = formatColor(opt?.background);
        this.Scene.environment = opt?.environment || null;
        this.Scene.castShadow = opt?.castShadow || false;
        // this.Scene.background = formatColor(opt?.background) || null;
        this.pushScene = (obj: any) => {
            this.Scene.add(obj)
        }
        this.setBackground()
    }
    clearScene() {
        this.Scene = new THREE.Scene()
    }
    overScene(scene: any) {
        this.clearScene()
        this.Scene = scene;
    }
    async overTexture(url: string) {
        // console.log(this.Scene);
        this.sceneOpt.background = url
        if (this.sceneOpt.backgroundType === 'cube') {
            let childs = this.Scene.children;
            for (let i = 0; i < childs.length; i++) {
                if (childs[i].name === 'skybox') {
                    let path = this.sceneOpt.background;//设置路径
                    let directions = ["px", "nx", "py", "ny", "pz", "nz"];//获取对象
                    let format = this.sceneOpt.format || '.jpg'
                    let skyboxCubemap = await new THREE.CubeTextureLoader().loadAsync([
                        path + directions[0] + format,
                        path + directions[1] + format,
                        path + directions[2] + format,
                        path + directions[3] + format,
                        path + directions[4] + format,
                        path + directions[5] + format
                    ]);
                    (await skyboxCubemap).format = THREE.RGBAFormat;
                    let skyboxShader = THREE.ShaderLib['cube'];
                    skyboxShader.uniforms['tCube'].value = skyboxCubemap;
                    childs[i].material = new THREE.ShaderMaterial({
                        fragmentShader: skyboxShader.fragmentShader,//片段着色器
                        vertexShader: skyboxShader.vertexShader,//顶点着色器
                        uniforms: skyboxShader.uniforms,//是所有顶点都具有相同的值的变量。 比如灯光， 雾，和阴影贴图就是被储存在uniforms中的数据。 uniforms可以通过顶点着色器和片元着色器来访问。
                        depthWrite: false,//深度测试
                        side: THREE.BackSide//正反面
                    })
                    this.Scene.environment = this.sceneOpt?.environment ? skyboxCubemap : null;
                }
            }
        }
    }
    getProductById(id: string) {//根据id获取构件
        return this.Scene.getObjectById(id);
    }
    getProductByName(name: string) {//根据name获取构件
        return this.Scene.getObjectByName(name);
    }
    getProductByProp(propName: string, value: any) {//根据userData中的属性获取构件
        return new Promise((resolve, reject) => {
            this.Scene.traverse((mesh: Mesh) => {
                if (mesh.userData[`${propName}`] && mesh.userData[`${propName}`] === value) {
                    resolve(mesh);
                }
            })
        })
    }
    async setBackground() {
        if (this.sceneOpt.backgroundType === 'color') {
            this.Scene.environment = this.sceneOpt?.environment || null;
            this.Scene.background = formatColor(this.sceneOpt?.background) || null;
            return;
        }
        if (this.sceneOpt.backgroundType === 'exr') {
            const dbs = await IndexDB.openDB(database.dbName, database.modelTable, database.versition);
            let data: any = null;
            // 加载exr环境图
            const exrLoader = new EXRLoader();
            let map: any;
            if (this.sceneOpt.dataBase) {
                data = await IndexDB.getDataByKey(dbs, database.modelTable, this.sceneOpt.dataBase?.id);
            } else {
                data = null;
            }
            const doData = async (type: 'add' | 'update') => {
                await httpGet(this.sceneOpt.background, { responseType: 'arraybuffer' }).then(async (res: any) => {
                    map = res;
                })
                if (this.sceneOpt.dataBase) {
                    switch (type) {
                        case 'add':
                            await IndexDB.addData(dbs, database.modelTable, {
                                id: this.sceneOpt.dataBase?.id, // 必须且值唯一
                                name: this.sceneOpt.dataBase?.name,
                                version: this.sceneOpt.dataBase?.version,
                                img: map
                            })
                            break;
                        case 'update':
                            await IndexDB.updateDB(dbs, database.modelTable, {
                                id: this.sceneOpt.dataBase?.id, // 必须且值唯一
                                name: this.sceneOpt.dataBase?.name,
                                version: this.sceneOpt.dataBase?.version,
                                img: map
                            })
                            break;
                        default:
                            break;
                    }
                }
            }
            if (!data) {
                await doData('add');
            } else {
                if (data.version !== this.sceneOpt.dataBase?.version) {
                    await doData('update')
                } else {
                    map = data.img
                }
            }
            map = exrLoader.parse(map)
            let texture = new THREE.DataTexture(map.data, map.width, map.height, THREE.RGBAFormat, map.type);
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.needsUpdate = true; //纹理更新
            this.Scene.background = texture;
            this.Scene.environment = this.sceneOpt?.environment ? texture : null;
            this._callback()
        }

        if (this.sceneOpt.backgroundType === 'cube') {
            let path = this.sceneOpt.background;//设置路径
            let directions = ["px", "nx", "py", "ny", "pz", "nz"];//获取对象
            let format = this.sceneOpt.format || '.jpg'
            let skyboxCubemap = await new THREE.CubeTextureLoader().loadAsync([
                path + directions[0] + format,
                path + directions[1] + format,
                path + directions[2] + format,
                path + directions[3] + format,
                path + directions[4] + format,
                path + directions[5] + format
            ]);
            (await skyboxCubemap).format = THREE.RGBAFormat;
            skyboxCubemap.encoding = THREE.sRGBEncoding;
            let skyboxShader = THREE.ShaderLib['cube'];
            skyboxShader.uniforms['tCube'].value = skyboxCubemap;
            let skyBox = new THREE.Mesh(
                new THREE.BoxGeometry(200, 200, 200),
                new THREE.ShaderMaterial({
                    fragmentShader: skyboxShader.fragmentShader,//片段着色器
                    vertexShader: skyboxShader.vertexShader,//顶点着色器
                    uniforms: skyboxShader.uniforms,//是所有顶点都具有相同的值的变量。 比如灯光， 雾，和阴影贴图就是被储存在uniforms中的数据。 uniforms可以通过顶点着色器和片元着色器来访问。
                    depthWrite: true,//深度测试
                    side: THREE.DoubleSide//正反面
                })
            );
            skyBox.name = 'skybox';
            this.Scene.background = skyboxCubemap;
            this.Scene.environment = this.sceneOpt?.environment ? skyboxCubemap : null;
            this.Scene.add(skyBox);
           
            this._callback()
        }
    }
}