import { Mesh, Vector3 } from "three";
import { iniOpt, sceneOpt, renderOpt, cameraOpt, lightsOpt, labelOpt, normalPos } from "./types";
export default class nsyModel {
    domView: HTMLElement;
    modelOpt: iniOpt;
    nsythr: any;
    nsySce: any;
    nsyRen: any;
    nsyCam: any;
    nsyLig: any;
    nsyControls: any;
    nsyLabel: any;
    nsyLoading: any;
    nsyWeather: any;
    resizeObserver: any;
    allModel: any;
    showMesh: Array<Mesh>;
    animateList: Array<any>;
    refreshRender: () => void;
    constructor(opt: iniOpt);
    init(): void;
    setScene(opt: sceneOpt): void;
    setRender(opt?: renderOpt): void;
    setCamera(opt?: cameraOpt): void;
    setLights(opt?: lightsOpt): void;
    setControls(): void;
    setloading(): void;
    loadIndex: number;
    _calcLoading(): void;
    addListener(): void;
    loadModels(): Promise<void>;
    openDebug(): void;
    _refreshActMesh(openAnimate?: boolean): void;
    animateCameraFun(newPos: Vector3, newTarget: Vector3, time?: number, callback?: Function): void;
    _addEventClick(): void;
    _removeEventClick(): void;
    _addEventdblClick(): void;
    _removeEventdblClick(): void;
    onPickUp(event: any): Promise<unknown>;
    _jumpAnimate(product: any, step?: number): void;
    _clearAnimate(): void;
    addSpriteLabel(e: any, doms: string, option: Array<labelOpt>): Promise<void>;
    updateSpriteLabel(data: any): Promise<void>;
    changeActModelByName(name: string, focus?: boolean): Promise<void>;
    showAllModels(): Promise<void>;
    hideAllModels(): Promise<void>;
    changeMeshEnvMap(): void;
    changeBackground(url: string): void;
    changeMeshOpc(mesh: any, opc: number): void;
    toggleTargetMesh(mesh: any, status: boolean): void;
    /**
     * @description: 移动构件
     * @param {string} propName 必选：构件userData中定义的字段key
     * @param {any} value 必选：构件userData中定义的字段value
     * @param {normalPos} position 必选：构件目标位置
     * @param {number} time 可选：过程动画的时间
     * @param {Function} callback 可选：移动完成后的回调函数
     * @return {*}
     */
    moveProduct(propName: string, value: any, position: normalPos, time?: number, callback?: Function): void;
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
    rotateProduct(propName: string, value: any, axis: string, rotate: number, step?: number, callback?: Function): void;
    /**
     * @description: 设置构建告警
     * @param {string} propName 必选：构件userData中定义的字段key
     * @param {any} value 必选：构件userData中定义的字段value
     * @param {string} color 告警颜色，默认为#f05
     * @param {number} time 闪烁频率
     * @param {boolean} depthTest 是否开启深度测试 默认开启，关闭后构件将不被遮挡
     * @return {*}
     */
    setProductNotice(propName: string, value: any, color?: string, time?: number, depthTest?: boolean): void;
    /**
     * @description: 消除构建告警
     * @param {string} propName 必选：构件userData中定义的字段key
     * @param {any} value 必选：构件userData中定义的字段value
     * @return {*}
     */
    resetProductNotice(propName: string, value: any): void;
}
