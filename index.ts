/*
 * @Author: ChenLinMao
 * @Date: 2023-03-22 09:08:47
 * @LastEditors: ChenLinMao
 * @LastEditTime: 2023-05-24 17:21:33
 * @FilePath: \nsyModel\public\nsyModel\index.ts
 * @Description: nsyModel插件
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { Mesh, Sprite, Camera, Vector3, Group, Object3D, MathUtils } from "three";
import { useCommon } from "./import"
import TWEEN from '@tweenjs/tween.js'
const { NSYTHR, Auth, nsyScene, nsyRender, nsyCamera, nsyLights, nsyControl, nsyLoading, nsyLabel, nsyWeather } = useCommon();
import nsyModels from "./model";
import { iniOpt, sceneOpt, renderOpt, cameraOpt, lightsOpt, labelOpt, normalPos } from "./types"
import { formatColor, vc3 } from "./utils";
export default class nsyModel {
    domView!: HTMLElement;//dom视口
    modelOpt!: iniOpt;//保存配置项变量
    nsythr: any;//保存的实例化三维库
    nsySce: any;//保存的三维场景变量
    nsyRen: any;//保存的三维渲染器
    nsyCam: any; //保存的相机
    nsyLig: any; // 多光源
    nsyControls: any;//轨道控制器
    nsyLabel: any;//动态标签
    nsyLoading: any;//loading
    nsyWeather: any;//天气系统
    resizeObserver: any; //dom尺寸监听器
    allModel: any;//模型容器
    showMesh: Array<Mesh> = [];//当前场景中显示的网格体
    animateList: Array<any> = [];//动画列表
    refreshRender = () => { // 刷新场景，显示动画等效果
        if (this && this.nsyRen) {
            this.nsyRen.Renderer.clear()
            this.nsyRen.Renderer.render(this.nsySce.Scene, this.nsyCam.Camera);
            requestAnimationFrame(this.refreshRender);
            TWEEN.update()
            this.nsyControls && this.nsyControls.Control.update();
            this.nsyWeather && this.nsyWeather.animate();
        } else {
            this.refreshRender()
        }
    };
    constructor(opt: iniOpt) {
        const ST = Auth.InitOpt(opt);
        if (ST !== 'success') {
            alert(ST);
            return;
        }
        this.nsythr = NSYTHR;
        this.domView = opt.dom;
        this.modelOpt = opt;
        this.nsyLabel = new nsyLabel();
        // console.log(this.nsyLabel);
    }
    init() {
        if (this.modelOpt.loading && this.modelOpt.loading.open) {
            this.setloading();
        }
        this.setScene(this.modelOpt.sceneOpt);
        this.setCamera(this.modelOpt.cameraOpt);
        this.setRender(this.modelOpt.renderOpt);
        this.domView.appendChild(this.nsyRen.Renderer.domElement);
        this.setLights(this.modelOpt.lights);
        this.loadModels();
        if (this.modelOpt.listenerSizeChange) this.addListener();
        if (this.modelOpt.onClick || this.modelOpt.debug) this._addEventClick()
        if (this.modelOpt.ondblClick) this._addEventdblClick()
        if (this.modelOpt.weather && this.modelOpt.weather.use) this.nsyWeather = new nsyWeather(this.modelOpt.weather)
    }
    setScene(opt: sceneOpt) {// 设置场景元素
        let scene = new this.nsythr.Scene();
        this.nsySce = new nsyScene(scene, opt, () => {
            if (this.nsyWeather) this.nsySce.pushScene(this.nsyWeather.instance)
        });
        if (this.modelOpt.debug) this.openDebug();
    }
    setRender(opt?: renderOpt) { // 设置渲染器
        // let render = new this.nsythr.WebGLRenderer(opt);
        // this.nsyRen = new nsyRender(render, opt);
        this.nsyRen = new nsyRender(opt);
        this.nsyRen.setSize(this.domView.clientWidth, this.domView.clientHeight);
    }
    setCamera(opt?: cameraOpt) { // 设置相机（当前只支持透视相机）
        let obj: cameraOpt = { ...opt };
        if (!obj) {
            obj = {
                fov: 45,
                aspect: window.innerWidth / window.innerHeight,
                near: 0.1,
                far: 1000
            }
        } else {
            obj.fov = obj.fov || 45;
            obj.aspect = obj.aspect || (this.domView.clientWidth / this.domView.clientHeight);
            obj.near = obj.near || 0.1;
            obj.far = obj.far || 1000;
        }
        let camera = new this.nsythr.PerspectiveCamera(
            obj.fov,
            obj.aspect,
            obj.near,
            obj.far
        );
        this.nsyCam = new nsyCamera(camera, obj);
        this.nsySce.pushScene(this.nsyCam.Camera);
    }
    setLights(opt?: lightsOpt) { // 设置多光源
        if (this.nsySce && opt) {
            this.nsyLig = new nsyLights(opt);
            // 将光源添加进场景
            this.nsyLig.ambientLight && this.nsySce.pushScene(this.nsyLig.ambientLight);
            for (let i = 0; i < this.nsyLig.directionalLights.length; i++) {
                this.nsySce.pushScene(this.nsyLig.directionalLights[i]);
            }
            for (let i = 0; i < this.nsyLig.pointLights.length; i++) {
                this.nsySce.pushScene(this.nsyLig.pointLights[i]);
            }
            this.nsyLig.hemisphereLight && this.nsySce.pushScene(this.nsyLig.hemisphereLight);
            for (let i = 0; i < this.nsyLig.spotLights.length; i++) {
                this.nsySce.pushScene(this.nsyLig.spotLights[i]);
            }
        }
    }
    setControls() {
        this.nsyControls = new nsyControl(this.nsyCam.Camera, this.nsyRen.Renderer.domElement, this.modelOpt.control);
        let vc = vc3(this.modelOpt.cameraOpt?.target?.x, this.modelOpt.cameraOpt?.target?.y, this.modelOpt.cameraOpt?.target?.z)
        this.nsyControls.setTarget(vc);
    }
    setloading() {
        this.nsyLoading = new nsyLoading(this.modelOpt.loading as any, this.modelOpt.dom);
    }
    loadIndex: number = 0;
    _calcLoading() {
        ++this.loadIndex;
        let len = (this.modelOpt.sceneOpt.backgroundType != 'color') ? 1 : 0;
        len = len + this.modelOpt.models.length;
        let num = Number((this.loadIndex / len * 100).toFixed(2));
        if (num < 100) this.nsyLoading.changeProg();
        if (num == 100) this.nsyLoading.hideLoading();
    }
    addListener() { // 监听dom元素尺寸的变化
        let _this = this
        this.resizeObserver = new ResizeObserver((entries) => {
            _this.nsyRen.Renderer.setSize(_this.domView.clientWidth, _this.domView.clientHeight);
            _this.nsyCam.sizeChange(_this.domView.clientWidth, _this.domView.clientHeight);
        })
        this.resizeObserver.observe(this.domView)
    }
    async loadModels() { // 加载模型（异步）
        this.allModel = new nsyModels(this.modelOpt.models);
        const mod = await this.allModel.loadGltf().then((res: any) => {
            for (let i = 0; i < res.length; i++) {
                let item = res[i];
                // if ((item.modelType == 'gltf' || item.modelType == 'glb'||item.modelType == 'json') && (item.active || res.length === 1)) {
                //     item.model.visible = true;
                // }
                // if ((item.modelType == 'json') && (item.active || res.length === 1)) {
                //     item.model.visible = true;
                // }
                // else { item.model.visible = false; }
                // console.log(item.model);

                if (item.active || res.length === 1) item.model.visible = true;
                if (!item.active) { item.model.visible = false; }
                if (item.modelType === 'gltf' || item.modelType === 'glb') this.nsySce.pushScene(item.model);
                if (item.modelType === 'json') {
                    this.nsySce.pushScene(item.model);
                }
            }
            this.modelOpt.onModelsLoaded && this.modelOpt.onModelsLoaded();
            if (this.modelOpt.onClick || this.modelOpt.ondblClick) this._refreshActMesh();
            this.setControls();
            this.refreshRender();
            if (this.nsyLoading) this.nsyLoading.hideLoading()
        });
        // console.log(this.allModel);
    }
    openDebug() {// 打开坐标系
        const axesHelper = new this.nsythr.AxesHelper(30);
        this.nsySce.pushScene(axesHelper);
    }
    _refreshActMesh(openAnimate: boolean = true) {//刷新并储存当前显示状态的所有模型的网格体
        this.showMesh = [];
        for (let i = 0; i < this.allModel.models.length; i++) {
            let mo: any = this.allModel.models[i];
            // console.log(mo);
            if (mo.visible) {
                mo.traverse((mesh: any) => {
                    if (mesh.isMesh || mesh.isSprite || mesh.isObject3D) {
                        this.showMesh.push(mesh);
                        // if(mesh.isMesh){
                        //     mesh.environment = this.nsySce.Scene.background
                        // }
                    } else {
                        console.log(mesh);
                    }
                    if (mesh.type === 'Group' && mesh.userData.needAnimate && openAnimate) {
                        this._clearAnimate()
                        this._jumpAnimate(mesh);
                    }
                })
            }
        }
    }
    //摄像头聚焦方法
    animateCameraFun(newPos: Vector3, newTarget: Vector3, time = 1000, callback?: Function) {
        if (!newPos || !newTarget) {
            console.log('该构件无坐标信息！');
            return;
        }
        let oldpos = this.nsyCam.getPos(), oldTar = this.nsyControls.getTarget();
        // 使用tween动画
        let tween = new TWEEN.Tween({
            x1: oldpos.x, // 相机x
            y1: oldpos.y, // 相机y
            z1: oldpos.z, // 相机z
            x2: oldTar.x, // 控制点的中心点x
            y2: oldTar.y, // 控制点的中心点y
            z2: oldTar.z, // 控制点的中心点z
        });
        tween.to({
            x1: newPos.x,
            y1: newPos.y,
            z1: newPos.z,
            x2: newTarget.x,
            y2: newTarget.y,
            z2: newTarget.z,
        }, time);
        tween.easing(TWEEN.Easing.Quintic.In);
        tween.onUpdate((pos: any) => {
            let vc_1 = vc3(pos.x1, pos.y1, pos.z1), vc_2 = vc3(pos.x2, pos.y2, pos.z2);
            this.nsyCam.setPos(vc_1)
            this.nsyControls.setTarget(vc_2);
        })
        tween.onComplete(() => {
            callback && callback()
        })
        // 开始动画
        tween.start()
    }
    _addEventClick() {
        this.domView.addEventListener("click", e => {
            this.onPickUp(e).then((res: any) => {
                let _tar: any = [], _first: any = null;
                res.forEach((item: any) => {
                    if (item.object.visible) _tar.push(item.object)
                })
                _first = _tar[0] ? _tar[0] : res[0].object;
                if (_first.type === "Sprite") {
                    this.animateCameraFun(
                        _first.userData.CameraPosition,
                        _first.userData.TargetPosition,
                    )
                    if (_first.userData.type === 'labelClose') {
                        _first.parent.visible = false;
                        let grpChilds = _first.parent.parent.children;
                        grpChilds.forEach((item: any) => {
                            if (item.userData.type === "labelOpen") {
                                item.visible = true
                            }
                        });
                    }
                    if (_first.userData.type === 'labelOpen') {
                        _first.visible = false;
                        let grpChilds = _first.parent.children;
                        grpChilds.forEach((item: any) => {
                            if (item != _first) {
                                item.visible = true;
                            }
                        });
                    }
                }
                this.modelOpt.onClick && this.modelOpt.onClick(res);
                if (this.modelOpt.debug) {
                    // res[0].point.x += 1;
                    console.log("TargetMesh：", res[0].object);
                    console.log({
                        CameraPosition: this.nsyCam.getPos(),
                        TargetPosition: res[0].point
                    });
                }
            })
        })
    }
    _removeEventClick() {
        this.domView.removeEventListener("click", e => {
            this.onPickUp(e)
        })
    }
    _addEventdblClick() {
        this.domView.addEventListener("dblclick", e => {
            this.onPickUp(e)
        })
    }
    _removeEventdblClick() {
        this.domView.removeEventListener("dblclick", e => {
            this.onPickUp(e)
        })
    }
    onPickUp(event: any) {// 鼠标拾取--点击事件
        return new Promise((resolve, reject) => {
            let dom = this.domView;
            let Sx = event.clientX; //鼠标单击位置横坐标
            let Sy = event.clientY; //鼠标单击位置纵坐标
            //屏幕坐标转WebGL标准设备坐标
            // console.log(dom.offsetLeft, dom.clientWidth, dom.getBoundingClientRect().left);
            let x = ((Sx - dom.getBoundingClientRect().left) / dom.clientWidth) * 2 - 1;
            let y = -((Sy - dom.getBoundingClientRect().top) / dom.clientHeight) * 2 + 1;
            //创建一个射线投射器`Raycaster`
            let raycaster = new this.nsythr.Raycaster();
            //通过鼠标单击位置标准设备坐标和相机参数计算射线投射器`Raycaster`的射线属性.ray
            raycaster.setFromCamera(new this.nsythr.Vector2(x, y), this.nsyCam.Camera);
            //返回.intersectObjects()参数中射线选中的网格模型对象
            // 未选中对象返回空数组[],选中一个数组1个元素，选中两个数组两个元素
            let intersects = raycaster.intersectObjects(this.showMesh);
            // console.log("射线投射器返回的对象", intersects);
            // console.log("射线投射器返回的对象 点point", intersects[0].point);
            // console.log("射线投射器返回的对象 几何体",intersects[0].object.geometry.vertices)
            // intersects.length大于0说明，说明选中了模型
            if (intersects.length > 0) {
                if (!intersects[0].visible)
                    resolve(intersects)
            } else {
                reject()
            }
        })
    }
    // yoyo跳动动画
    _jumpAnimate(product: any, step = 0.6) {
        product.clonePosition = product.position;
        // 使用tween动画
        let tween = new TWEEN.Tween({ y: product.position.y });
        tween.to({ y: product.position.y + step }, 1000);
        tween.easing(TWEEN.Easing.Cubic.Out);
        tween.onUpdate((pos: any) => {
            product.position.y = pos.y
        })
        tween.repeat(Infinity); //动画一直执行
        tween.yoyo(true); //启用yoyo效果
        // 开始动画
        tween.start();
        this.animateList.push(tween);
    }
    // 清除所有动画效果
    _clearAnimate() {
        for (let i = 0; i < this.animateList.length; i++) {
            this.animateList[i].stop()
        }
        this.animateList = []
    }
    async addSpriteLabel(e: any, doms: string, option: Array<labelOpt>) {
        for (let i = 0; i < option.length; i++) {
            await this.nsyLabel.createSpriteShape(doms, option[i]).then((res: any) => {
                this.nsySce.Scene.add(res)
                e.add(res)
            });
        }
    }
    async updateSpriteLabel(data: any) {
        data.forEach((item: any) => {
            this.nsySce.getProductByProp('id', item.id).then((res: any) => {
                this.nsyLabel.updateSpriteShape(item.dom, item.id, res)
            });
        })
    }
    //通过模型name改变场景中显示的模型(name:模型名称；focus:显示后是否聚焦，当为true时，需要配置该模型的CameraPosition和TargetPosition)
    async changeActModelByName(name: string, focus?: boolean) {
        let models = this.allModel.models, index: number = 0;
        // let topT = this.nsyCam.getTar(), topP = this.nsyCam.getPos();
        // topP.y += 20;
        // this.nsyCam.setPos(topP);
        // this.nsyCam.setTar(topP);
        for (let i = 0; i < models.length; i++) {
            let item = models[i];
            if (item.name === name) {
                item.visible = true;
                // console.log(item);
                // setTimeout(() => {
                if (focus) this.animateCameraFun(vc3(item.userData.CameraPosition), vc3(item.userData.TargetPosition), 1200);
                // }, 1000);
            }
            else {
                item.visible = false;
            }
        }
        // this.animateCameraFun(vc3(topP), vc3(topP), 1000, () => {

        // })

        // if (focus) {
        //     setTimeout(() => {
        //         let _tar = vc3(this.modelOpt.models[index].TargetPosition);
        //         let _car = vc3(this.modelOpt.models[index].CameraPosition);
        //         console.log(_tar, _car,index);
        //         if (!_tar || !_car) {
        //             console.log('没找到该模型的相机配置');
        //         }
        //     }, 1000);
        // }
        this._refreshActMesh()
    }
    //显示所有模型
    async showAllModels() {
        let models = this.allModel.models;
        await models.forEach((item: any) => {
            item.visible = true;
        });
        this._refreshActMesh()
    }
    //隐藏所有模型
    async hideAllModels() {
        let models = this.allModel.models;
        await models.forEach((item: any) => {
            item.visible = false;
        });
        this._refreshActMesh()
    }
    //改变网格体的环境贴图
    changeMeshEnvMap() {
        this.showMesh.forEach((item: any) => {
            if (item.material && item.material.envMap) {
                item.material.envMap = this.nsySce.Scene.background
            }
        })
    }
    // 改变背景
    changeBackground(url: string) {
        this.nsySce.overTexture(url)
    }
    // 修改mesh透明度
    changeMeshOpc(mesh: any, opc: number) {
        mesh.material.opacity = opc
    }
    // 显示/隐藏mesh
    toggleTargetMesh(mesh: any, status: boolean) {
        mesh && mesh.visible && (mesh.visible = status)
    }

    /**
     * @description: 移动构件
     * @param {string} propName 必选：构件userData中定义的字段key
     * @param {any} value 必选：构件userData中定义的字段value
     * @param {normalPos} position 必选：构件目标位置
     * @param {number} time 可选：过程动画的时间
     * @param {Function} callback 可选：移动完成后的回调函数 
     * @return {*}
     */
    moveProduct(propName: string, value: any, position: normalPos, time: number = 2000, callback?: Function) {
        this.nsySce.getProductByProp(propName, value).then((res: any) => {
            let tween = new TWEEN.Tween({
                x: res.position.x,
                y: res.position.y,
                z: res.position.z
            });
            tween.to({
                x: position.x,
                y: position.y,
                z: position.z
            }, time);
            tween.easing(TWEEN.Easing.Linear.None);
            tween.onUpdate((pos: normalPos) => {
                res.position.set(pos.x, pos.y, pos.z);
            });
            tween.onComplete(() => {
                callback && callback();
            });
            // 开始动画
            tween.start();
        });
    }

    /**
     * @description: 旋转构件
     * @param {string} propName 必选：构件userData中定义的字段key
     * @param {any} value 必选：构件userData中定义的字段value
     * @param {string} axis 必选：可选值为'x','y','z'
     * @param {number} rotate 必选：旋转角度
     * @param {number} step 步长，默认为0.1
     * @param {Function} callback 回调函数
     * @return {*}
     */
    rotateProduct(propName: string, value: any, axis: string, rotate: number,step:number=0.1, callback?: Function) {
        this.nsySce.getProductByProp(propName, value).then((res: any) => {
            let psr = Math.round(rotate / step),index=0;
            let timer = setInterval(() => {
                switch (axis) {
                    case 'x':
                        res.rotateX(MathUtils.degToRad(step));
                        break;
                    case 'y':
                        res.rotateY(MathUtils.degToRad(step));
                        break;
                    case 'z':
                        res.rotateZ(MathUtils.degToRad(step));
                        break;
                    default:
                        break;
                }
                index++;
                if(index>=psr){
                    psr=0;
                    index=0;
                    clearInterval(timer);
                    callback&&callback();
                }
            }, 10);
        });
    }

    /**
     * @description: 设置构建告警
     * @param {string} propName 必选：构件userData中定义的字段key
     * @param {any} value 必选：构件userData中定义的字段value
     * @param {string} color 告警颜色，默认为#f05
     * @param {number} time 闪烁频率     
     * @param {boolean} depthTest 是否开启深度测试 默认开启，关闭后构件将不被遮挡
     * @return {*}
     */
    setProductNotice(propName: string, value: any,color:string='#f05',time:number=800,depthTest:boolean=true){
        this.nsySce.getProductByProp(propName, value).then((res: any) => {
            res.material.depthTest = depthTest;
            res.material.coverColor = {
                defaultColor:res.material.color,
                color: formatColor(color)
            };
            res.material.noticeTimer = setInterval(()=>{
                let copy = res.material.color;
                res.material.color = res.material.coverColor.color;
                res.material.coverColor.color = copy;
            },time);
        });
    }
    /**
     * @description: 消除构建告警
     * @param {string} propName 必选：构件userData中定义的字段key
     * @param {any} value 必选：构件userData中定义的字段value
     * @return {*}
     */
    resetProductNotice(propName: string, value: any){
        this.nsySce.getProductByProp(propName, value).then((res: any) => {
            clearInterval(res.material.noticeTimer);
            res.material.color=res.material.coverColor.defaultColor;
            res.material.depthTest=true;
        });
    }
}