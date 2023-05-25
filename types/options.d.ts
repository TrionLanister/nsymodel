/*
 * @Author: ChenLinMao
 * @Date: 2023-03-22 09:38:29
 * @LastEditors: ChenLinMao
 * @LastEditTime: 2023-04-26 15:24:00
 * @FilePath: \nsyModel\public\nsyModel\types\options.d.ts
 * @Description: 配置项类型说明
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
/**
 * @description: 初始化参数声明
 * @return {*}
 */
import { controlOpt } from "./controls"
export interface iniOpt {
    loading?: Loading,
    dom: HTMLElement,
    sceneOpt: sceneOpt,
    renderOpt?: renderOpt,
    cameraOpt?: cameraOpt,
    listenerSizeChange?: boolean,
    lights: lightsOpt,
    models: Array<modelsOpt>,
    onModelsLoaded?: Function,
    control?: controlOpt,
    debug?: boolean,
    onClick?: Function,
    ondblClick?: Function,
    weather?: weatherOpt,
}

/**
 * @description: 模型配置参数声明
 * @return {*}
 */
export interface modelsOpt {
    url: string,//模型地址
    modelType: 'gltf' | 'glb' | 'json',
    active?: boolean,// 是否显示 默认false不显示
    draco: boolean,// 模型文件是否采用了draco压缩
    loaderUrl?: string, //模型对应的解码器地址 默认为：nsyModel/model/draco/gltf/
    onLoaded?: Function, // 当前模型加载完毕后的回调函数
    specilMember?: any, // 特殊构件设置
    globalMember?: any,// 模型全局构件设置
    dataBase?: dataBase,//indexDB配置
    name?: string,// 模型名称（会覆盖原先模型中的name字段）
    version?: string, // 模型版本号
    CameraPosition?:normalPos, // 调整到该模型时，相机位置 
    TargetPosition?:normalPos,// 调整到该模型时，相机聚焦中心点位置 
}

// loading配置项声明
export interface Loading {
    open: boolean,
    apBody?: boolean
}

//天气系统类型声明
export interface weatherOpt {
    open: boolean,// 是否默认展示
    use:boolean, // 是否启用天气系统
    rainSize?: number,//雨点大小
    rainSpeed: number, //雨下落速度
    rainDrops?: number, //雨量
    imgSrc?: string,//雨雪图片的src地址
    autoRotate?: boolean,//是否开启自动旋转雨/雪场
    rainRange?: normalPos, //雨点下落范围
    rainPosition?: normalPos //雨场的位置
    rotaSpeed?:number,//旋转速度
}


// indexdb的参数类型声明
export interface dataBase {
    id: number,
    version: string,
    name: string,
}


interface normalPos { // 普通xyz坐标
    x: number,
    y: number,
    z: number
}

/**
 * @description: 场景参数声明
 * @return {*}
 */
export interface sceneOpt {
    background?: any,//背景  注意：在backgroundType 为 cube时，background代表全景图六个面图片所在的文件夹地址！
    environment?: any,//环境
    format?:string,//在backgroundType 为 cube时，format代表全景图格式的后缀
    castShadow?: boolean,//是否包含阴影
    backgroundType: 'exr' | 'color' | 'cube'|'test',//背景类型：'exr'全景\纯色背景\天空盒全景\测试
    dataBase?: dataBase
}
/**
 * @description: 渲染器参数声明
 * @return {*}
 */
export interface renderOpt {
    antialias?: boolean,//是否执行抗锯齿。默认为false.
    alpha?: boolean,//控制默认的清除alpha值。当设置为true时，该值为0。否则是1。默认值为false。
    canvas?: HTMLElement,//一个供渲染器绘制其输出的canvas 它和下面的domElement属性对应。 如果没有传这个参数，会创建一个新canvas
    context?: any,//可用于将渲染器附加到已有的渲染环境(RenderingContext)中。默认值是null
    precision?: string,//着色器精度. 可以是 "highp", "mediump" 或者 "lowp". 如果设备支持，默认为"highp" 
    premultipliedAlpha?: boolean,//renderer是否假设颜色有 premultiplied alpha. 默认为true
    stencil?: boolean, //绘图缓存是否有一个至少8位的模板缓存(stencil buffer)。默认为true
    preserveDrawingBuffer?: boolean, //是否保留缓直到手动清除或被覆盖。 默认false.
    powerPreference?: string, // 提示用户代理怎样的配置更适用于当前WebGL环境。 可能是"high-performance", "low-power" 或 "default"。默认是"default".
    failIfMajorPerformanceCaveat?: boolean,//检测渲染器是否会因性能过差而创建失败。默认为false
    depth?: boolean,  // 绘图缓存是否有一个至少6位的深度缓存(depth buffer )。 默认是true.
    logarithmicDepthBuffer?: boolean, //是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。 默认是false
    shadowMapEnabled?: boolean,//是否启用阴影
}
/**
 * @description: 相机参数声明
 * @return {*}
 */
export interface cameraOpt {
    fov?: number, // 摄像机视锥体垂直视野角度
    aspect?: number, // 摄像机视锥体长宽比
    near?: number, // 摄像机视锥体近端面
    far?: number, // 摄像机视锥体远端面
    position?: normalPos,//摄像机位置
    target?: normalPos,//摄像机焦点
}
/**
 * @description: 环境光参数声明
 * @return {*}
 */
export interface ambientLi {
    color?: any,//颜色的rgb数值。缺省值为 0xffffff。
    intensity?: number,//光照的强度。缺省值为 1。
}

/**
 * @description: 平行光参数声明
 * @return {*}
 */
export interface directionalLi {
    color?: any,//颜色的rgb数值。缺省值为 0xffffff。
    intensity?: number,//光照的强度。缺省值为 1。
    castShadow?: boolean,//如果设置为 true 该平行光会产生动态阴影。
    position?: any,//位置：假如这个值设置等于 (0, 1, 0),那么光线将会从上往下照射。
    target?: any
    // shadow?:any,
}
/**
 * @description: 点光源参数声明
 * @return {*}
 */
export interface pointLi {
    color?: any,//颜色的rgb数值。缺省值为 0xffffff。
    intensity?: number,//光照的强度。缺省值为 1。
    distance?: number,// 这个距离表示从光源到光照强度为0的位置。 当设置为0时，光永远不会消失(距离无穷大)。缺省值 0.
    decay?: number, // 沿着光照距离的衰退量。缺省值 2。
    castShadow?: boolean,//如果设置为 true 该平行光会产生动态阴影。
    position?: any,//位置：假如这个值设置等于 (0, 1, 0),那么光线将会从上往下照射。
}
/**
 * @description: 半球光参数声明
 * @return {*}
 */
export interface hemisphereLi {
    skyColor?: any, // (可选参数) 天空中发出光线的颜色。 缺省值 0xffffff。
    groundColor?: any, //(可选参数) 地面发出光线的颜色。 缺省值 0xffffff。
    intensity?: number, // (可选参数) 光照强度。 缺省值 1。
    position?: any,//位置：假如这个值设置等于(0, 1, 0),那么光线将会从上往下照射。
}
/**
 * @description: 聚光灯参数声明
 * @return {*}
 */
export interface spotLi {
    color?: any,//颜色的rgb数值。缺省值为 0xffffff。
    intensity: number, //(可选参数) 光照强度。 缺省值 1。
    distance: number,// 这个距离表示从光源到光照强度为0的位置。 当设置为0时，光永远不会消失(距离无穷大)。缺省值 0.
    angle: any, // 光线散射角度，最大为Math.PI/2。
    penumbra: number, // 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
    decay?: number, //沿着光照距离的衰减量。
    castShadow?: boolean,//如果设置为 true 该平行光会产生动态阴影。
    position?: any,//位置：假如这个值设置等于(0, 1, 0),那么光线将会从上往下照射。
}
/**
 * @description: 多光源配置参数
 * @return {*}
 */
export interface lightsOpt {
    ambientLight?: ambientLi,
    directionalLights?: directionalLi[],
    pointLights?: pointLi[],
    hemisphereLight?: hemisphereLi,
    spotLights?: spotLi[]
}