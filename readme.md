

---
# 什么是 nsyModel
nsyModel 是一款***基于threejs的模型加载工具库***，对threejs等插件进行多种常用方法的ts封装，同时融入了天气、水面和喷淋系统，经过简单的配置项即可实现想要的功能。
---
## 安装nsyModel
使用`yarn add nsymodel`或者`npm install nsymodel`

## 开始使用
```typescript
import nsyModel from "nsyModel/index.js"
let modelView: any = null;
onMounted(() => {
    modelView = new nsyModel(option);
    modelView.init();
})
```
## 初始化配置项说明（option）
### 总览
```typescript
    {
        loading?: Loading,
        dom: HTMLElement//注意：此dom宽高不为0！
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
```


----------
### 详细

- loading 加载进度
```typescript
{
    open: boolean,//是否启用loading
    apBody?: boolean//是否将生成的loading插入到body
}
```
- dom 场景容器的dom 注意：此dom宽高不为0！
- sceneOpt 场景配置项

```typescript
{
background?: any,//背景  注意：在backgroundType 为 cube时，background代表全景图六个面图片所在的文件夹地址！
environment?: any,//环境
format?:string,//在backgroundType 为 cube时，format代表全景图格式的后缀
castShadow?: boolean,//是否包含阴影
backgroundType: 'exr' | 'color' | 'cube'|'test',//背景类型：'exr'全景\纯色背景\天空盒全景\测试
dataBase?:{
        id: number,//模型id
        version: string,//模型版本号
        name: string,//模型名称
    } //浏览器indexDB的模型参数说明
}
```
 - renderOpt 渲染器配置项
```typescript
{
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
```
 - cameraOpt 相机配置项
```typescript
{
    fov?: number, // 摄像机视锥体垂直视野角度
    aspect?: number, // 摄像机视锥体长宽比
    near?: number, // 摄像机视锥体近端面
    far?: number, // 摄像机视锥体远端面
    position?: normalPos,//摄像机位置
    target?: normalPos,//摄像机焦点
}
```
 - listenerSizeChange 是否监听容器尺寸改变true/false
 - lights 光源配置项 
```typescript
{
    ambientLight?: { //环境光配置
        color?: any,//颜色的rgb数值。缺省值为 0xffffff。
        intensity?: number,//光照的强度。缺省值为 1。
    },
    directionalLights?: [{//方向光配置，可多个
        color?: any,//颜色的rgb数值。缺省值为 0xffffff。
        intensity?: number,//光照的强度。缺省值为 1。
        castShadow?: boolean,//如果设置为 true 该平行光会产生动态阴影。
        position?: any,//位置：假如这个值设置等于 (0, 1, 0),那么光线将会从上往下照射。
        target?: any
        // shadow?:any,
    }],
    pointLights?: [{//点光源配置，可多个
        color?: any,//颜色的rgb数值。缺省值为 0xffffff。
        intensity?: number,//光照的强度。缺省值为 1。
        distance?: number,// 这个距离表示从光源到光照强度为0的位置。 当设置为0时，光永远不会消失(距离无穷大)。缺省值 0.
        decay?: number, // 沿着光照距离的衰退量。缺省值 2。
        castShadow?: boolean,//如果设置为 true 该平行光会产生动态阴影。
        position?: any,//位置：假如这个值设置等于 (0, 1, 0),那么光线将会从上往下照射。
    }],
    hemisphereLight?:  {//环境光配置
        skyColor?: any, // (可选参数) 天空中发出光线的颜色。 缺省值 0xffffff。
        groundColor?: any, //(可选参数) 地面发出光线的颜色。 缺省值 0xffffff。
        intensity?: number, // (可选参数) 光照强度。 缺省值 1。
        position?: any,//位置：假如这个值设置等于(0, 1, 0),那么光线将会从上往下照射。
    },
    spotLights?: [{//聚光灯配置，可多个
        color?: any,//颜色的rgb数值。缺省值为 0xffffff。
        intensity: number, //(可选参数) 光照强度。 缺省值 1。
        distance: number,// 这个距离表示从光源到光照强度为0的位置。 当设置为0时，光永远不会消失(距离无穷大)。缺省值 0.
        angle: any, // 光线散射角度，最大为Math.PI/2。
        penumbra: number, // 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
        decay?: number, //沿着光照距离的衰减量。
        castShadow?: boolean,//如果设置为 true 该平行光会产生动态阴影。
        position?: any,//位置：假如这个值设置等于(0, 1, 0),那么光线将会从上往下照射。
    }]
}
```
 - models 模型列表配置 array<obj>类型
```typescript
{
    url: string,//模型地址
    modelType: 'gltf' | 'glb' | 'json', // 加载类型
    active?: boolean,// 是否显示 默认false不显示
    draco: boolean,// 模型文件是否采用了draco压缩
    loaderUrl?: string, //模型对应的解码器地址 默认为：nsyModel/model/draco/gltf/
    onLoaded?: Function, // 当前模型加载完毕后的回调函数
    specilMember?: any, // 特殊构件设置
    globalMember?: any,// 模型全局构件设置
    dataBase?: {
        id: number,
        version: string,
        name: string,
    },//indexDB配置
        name?: string,// 模型名称（会覆盖原先模型中的name字段）
        version?: string, // 模型版本号
        CameraPosition?:{ // 普通xyz坐标
        x: number,
        y: number,
        z: number
    }, // 调整到该模型时，相机位置 
    TargetPosition?:{ // 普通xyz坐标
        x: number,
        y: number,
        z: number
    },// 调整到该模型时，相机聚焦中心点位置 
}
```
 - onModelsLoaded 所有模型加载完成后的回调函数
 - control 轨道控制器配置项
```typescript
{
    //自动旋转
    autoRotate?: boolean,
    // 自动旋转速度
    autoRotateSpeed?: number,
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    enableDamping?:boolean,
    // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
    dampingFactor?: number,
    // 是否可以旋转
    enableRotate?: boolean,
    // 是否可以缩放与缩小
    enableZoom?: boolean,
    // 上下旋转范围
    minPolarAngle?:number,
    maxPolarAngle?: number,
    // 左右旋转范围
    minAzimuthAngle ?:number,
    maxAzimuthAngle ?: number,
    // 设置相机距离原点的最近距离
    minDistance ?: number,
    // 设置相机距离原点的最远距离
    maxDistance ?:number,
    // 是否开启右键拖拽
    enablePan?: boolean,
    // 是否开启监听->在控件状态改变的过程中时
    onChange?:Function,
    // 是否开启监听->在控件状态改变的开始时
    onStart?:Function,
    // 是否开启监听->在控件状态改变的结束时
    onEnd?:Function,
}
```
 - debug 是否开启debug模式 true/false
 - onClick 点击事件 Function 
 - ondblClick 双击时间 Function
 - weather 天气系统配置项
```typescript
{
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
```


----------


## 方法



### 标签相关
 - addSpriteLabel 添加精灵标签（此类标签将始终保持正对相机）
```typescript
let dom = '<div id="demo-1"><table><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr></table></div><div id="demo-2"><table><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr></table></div><div id="demo-3"><table><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444455544</td></tr></table></div>';
let option = [{
    id: 'demo-1',//该标签对应的dom字符串中的标签id
    position: { // 点击该标签位置
      "x": -4.4712443188537,
      "y": 3,
      "z": -2.879555675256142
    },
    scale: { x: 5, y: 3, z: 4 },//标签缩放
    closeBtn: {// 标签关闭按钮
      url: 'images/close_label.png',//按钮贴图位置
      center: { x: 0, y: -4.5, z: 0 },//按钮中心点
      scale: { x: 0.35, y: 0.35, z: 0.35 },//按钮缩放
    },
    openBtn: {// 标签打开按钮
      url: 'images/notice.png',//按钮贴图位置
      position: {//按钮位置
        "x": -4.4712443188537,
        "y": 1.5,
        "z": -2.879555675256142
      },
      scale: { x: 0.5, y: 0.5, z: 0.5 },//按钮缩放
    },
    cameraPosition: {//点击该标签后，相机转到的位置
      "x": -3.6881199024404516,
      "y": 5.283624006440176,
      "z": 8.426587973482047
    }
    },
    {
      id:'demo-2',
      position:{x:0,y:3,z:0},
      scale:{x:5,y:3,z:4}
    },{
      id:'demo-3',
      position:{x:0,y:3,z:-2},
      scale:{x:5,y:3,z:4}
}]
//m代表在模型实例化的对象，dom代表label的dom字符串，option是上方的配置项；
modelView.addSpriteLabel(m, dom, option); 
```
 - updateSpriteLabel 更新对应的精灵标签
```typescript
let obj = {
        id: 'demo-1',//标签配置时的标签id
        dom:'<div id="demo-1"><table><tr><td>1一一一一</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr></table></div><div id="demo-2"><table><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr></table></div><div id="demo-3"><table><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444444</td></tr><tr><td>111</td><td>222</td><td>333</td><td>444455544</td></tr></table></div>'
    }//新的dom字符串
let data = [obj]//array,可更新多个
modelView.updateSpriteLabel(data);
```


----------


### 模型操作
 - changeActModelByName 通过模型的name字段（初始化配置项中的name），改变场景中显示的模型
```typescript
//通过模型name改变场景中显示的模型(name:模型名称；focus:显示后是否聚焦，当为true时，需要配置该模型的CameraPosition和TargetPosition)
modelView.changeActModelByName("stlsysxt", true)
```
 - showAllModels 显示所有模型
 - hideAllModels 隐藏所有模型
 - changeMeshEnvMap 改变网格体的环境贴图
```typescript
modelView.changeMeshEnvMap();//测试修改环境贴图,注意：需要再此之前先修改场景环境
```
 - changeBackground 改变模型背景  （目前仅支持cube类型的环境背景）
```typescript
modelView.changeBackground('images/sky/rain/');
//参数为新的环境图位置文件夹，为了统一命名规范，六张图片命名为"px", "nx", "py", "ny", "pz", "nz"
```
 - changeMeshOpc 改变网格体的透明度
```typescript
modelView.changeMeshOpc(mesh, 0.35);//参数1为网格体，参数2是透明度
```
 - toggleTargetMesh 显示/隐藏mesh
```typescript
modelView.toggleTargetMesh(mesh, false);//参数1为网格体，参数2是状态
```


----------
### 天气系统

 - nsyWeather.changeTexture 改变雨雪的贴图（修改天气）
```typescript
modelView.nsyWeather.changeTexture("/images/snow.png");//参数为天气贴图的url：雨滴 雪片
```
 - nsyWeather.changeRSpeed 修改雨下的速度
```typescript
modelView.nsyWeather.changeRSpeed(0.00001);//参数为速度值
```
 - nsyWeather.changeRDrops 修改雨/雪量
```typescript
modelView.nsyWeather.changeRDrops(300);//修改雨/雪量，参数越大 ，雨雪越多
```
 - nsyWeather.changeRSize 修改雨/雪大小
```typescript
modelView.nsyWeather.changeRSize(1)//修改雨/雪大小
```


----------
### 局部构件操作
- rotateProduct 构件旋转
```typescript
//调用示例
modelView.rotateProduct("name", "Rectangle204",'x',180,1);
//参数说明
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
rotateProduct(propName: string, value: any, axis: string, rotate: number,step:number=0.1, callback?: Function)
```
- moveProduct 构件移动
```typescript
//调用示例
modelView.moveProduct("name", "Rectangle204",{x:0,y:0,z:0},3000);
//参数说明
/**
     * @description: 移动构件
     * @param {string} propName 必选：构件userData中定义的字段key
     * @param {any} value 必选：构件userData中定义的字段value
     * @param {normalPos} position 必选：构件目标位置
     * @param {number} time 可选：过程动画的时间
     * @param {Function} callback 可选：移动完成后的回调函数 
     * @return {*}
     */
    moveProduct(propName: string, value: any, position: normalPos, time: number = 2000, callback?: Function)
```
- setProductNotice 测试告警
```typescript
//调用示例
modelView.setProductNotice("name", "Rectangle204",'#f05',300,false);
//参数说明
    /**
     * @description: 设置构建告警
     * @param {string} propName 必选：构件userData中定义的字段key
     * @param {any} value 必选：构件userData中定义的字段value
     * @param {string} color 告警颜色，默认为#f05
     * @param {number} time 闪烁频率     
     * @param {boolean} depthTest 是否开启深度测试 默认开启，关闭后构件将不被遮挡
     * @return {*}
     */
    setProductNotice(propName: string, value: any,color:string='#f05',time:number=800,depthTest:boolean=true)
```
- resetProductNotice 还原构件状态，消除告警状态
```typescript
//调用示例
modelView.setProductNotice("name", "Rectangle204",'#f05',300,false);
//参数说明
/**
     * @description: 消除构建告警
     * @param {string} propName 必选：构件userData中定义的字段key
     * @param {any} value 必选：构件userData中定义的字段value
     * @return {*}
     */
    resetProductNotice(propName: string, value: any)
```


----------
## 插件
### 水面插件
![在这里插入图片描述](https://img-blog.csdnimg.cn/5fed67bc756d466ba7b77812ea96066e.gif#pic_center)

[video(video-b9cd14ze-1684925823236)(type-csdn)(url-https://live.csdn.net/v/embed/299111)(image-https://video-community.csdnimg.cn/vod-84deb4/290d7a40fa2071ed80ca6733a78e0102/snapshots/fd279e46c9ff4f37bdcf9a7faceafd38-00001.jpg?auth_key=4838525161-0-0-ff88d2a4697c75c6a675cab8f9dd57c5)(title-waterface)]

#### 使用
```typescript
//引入
import { water } from "nsyModel/import/waterFace"
// 示例
let ms = water({
waterNormalsUrl: 'nsymodel/import/waterFace/waternormals.jpg', size: {
  width: 20,
  height: 32
},
distortionScale: 3.7,
position: {
  x: -1.2,
  z: 4,
  y: -1.7
}
});
m.add(ms);//将水面添加进场景。 m 为场景或者模型容器
setInterval(() => { // 此处作用是为了让水面产生流动效果
ms.material.uniforms['time'].value += 0.15 / 60.0;
}, 10);
```
#### 参数说明
```typescript
{// 配置项
    textureWidth?:number;//贴图宽
    textureHeight?:number;//贴图高
    waterNormalsUrl?:string;//贴图url
    alpha?:number;//水面透明度
    sunColor?:Color;//阳光颜色
    waterColor?:Color;//水面颜色
    distortionScale?:number;//失真比例
    position?:{x:number,y:number,z:number};//水面位置
    size:{
        width:number,//水面宽度
        height:number//水面高度
    }
}
```


----------
### 喷淋头效果（模拟六个等级的降雨0到5，雨量递增）
![在这里插入图片描述](https://img-blog.csdnimg.cn/32f7f92764fc4d05a470cb5a858c0246.gif#pic_center)

[video(video-cojAw9In-1684925219248)(type-csdn)(url-https://live.csdn.net/v/embed/299110)(image-https://video-community.csdnimg.cn/vod-84deb4/db92e200fa1f71edbd700764a3fd0102/snapshots/628487df83ea4cf191599dbd3d7fa4b7-00001.jpg?auth_key=4838525031-0-0-a95f8921877ead8ffd50b0548eae6ed6)(title-spray)]

#### 使用
```typescript
//引入
import Spray from "nsyModel/import/particle"
// 示例
sp = new Spray({
level: 2,
sprayHeight: 5.2,
sprayItems: spraylist//spraylist为每个喷淋头的配置
});
let group = sp.initSpray();// 初始化生成喷淋组group
m.add(group);//将喷淋组添加进场景。 m 为场景或者模型容器
sp.sprayAnimateStart();//开始喷淋动画
```
#### 参数说明
```typescript
sprayOpt{
    level:number;//雨量等级0-5
    sprayHeight:number;//从喷淋头顶部算起，到水滴滴落的高度
    sprayItems:{
    color:string;//水滴颜色，默认白色
    size:number;//水滴尺寸
    positions:any;//喷淋头位置
    }
}
```
#### 方法
- initSpray 初始化方法，返回喷淋头group
- sprayAnimateStart 开启喷淋动画
- sprayAnimateStop 暂停喷淋动画
- sprayRemove 删除喷淋头和雨滴
- spraySetLevel 改变雨量等级0-5

