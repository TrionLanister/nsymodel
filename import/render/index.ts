/*
 * @Description: 
 * @Version: 2.0
 * @Autor: CHENlm
 * @Date: 2023-03-24 19:44:37
 * @LastEditors: ChenLinMao
 * @LastEditTime: 2023-05-15 15:57:17
 */
import { renderOpt } from "../../types"
import * as THREE from "three";
export default class render {
    Renderer:any;
    renderOpt;
    constructor(parameters?: renderOpt) {
        // if ( WebGPU.isAvailable() === false ) {
            this.Renderer = new THREE.WebGLRenderer(parameters);
        // }else{
            // this.Renderer = new WebGPURenderer({...parameters});
            // this.Renderer.init()
        // }

        
        this.renderOpt = parameters;
        this.renderOpt && this.initRender(this.renderOpt)
    }
    setSize(width: number, height: number) {
        this.Renderer.setSize(width, height);
        this.Renderer.setPixelRatio(window.devicePixelRatio);
    }
    clear() {
        this.Renderer.clear()
    }
    initRender(opt: renderOpt) {
        // await this.Renderer.init()
        this.Renderer.antialias = opt.antialias || false; //是否执行抗锯齿。默认为false.
        this.Renderer.alpha = opt.alpha || false;//控制默认的清除alpha值。当设置为true时，该值为0。否则是1。默认值为false。
        this.Renderer.canvas = opt?.canvas;//一个供渲染器绘制其输出的canvas 它和下面的domElement属性对应。 如果没有传这个参数，会创建一个新canvas
        this.Renderer.context = opt.context || null;//可用于将渲染器附加到已有的渲染环境(RenderingContext)中。默认值是null
        this.Renderer.precision = opt.precision || 'highp'; //着色器精度. 可以是 "highp", "mediump" 或者 "lowp". 如果设备支持，默认为"highp" 
        this.Renderer.premultipliedAlpha = opt.premultipliedAlpha || true; //renderer是否假设颜色有 premultiplied alpha. 默认为true
        this.Renderer.stencil = opt.stencil || true; //绘图缓存是否有一个至少8位的模板缓存(stencil buffer)。默认为true
        this.Renderer.preserveDrawingBuffer = opt.preserveDrawingBuffer || false; //是否保留缓直到手动清除或被覆盖。 默认false.
        this.Renderer.powerPreference = opt.powerPreference || 'default'; // 提示用户代理怎样的配置更适用于当前WebGL环境。 可能是"high-performance", "low-power" 或 "default"。默认是"default".
        this.Renderer.failIfMajorPerformanceCaveat = opt.failIfMajorPerformanceCaveat || false;//检测渲染器是否会因性能过差而创建失败。默认为false
        this.Renderer.depth = opt.depth || true;// 绘图缓存是否有一个至少6位的深度缓存(depth buffer )。 默认是true.
        this.Renderer.logarithmicDepthBuffer = opt.logarithmicDepthBuffer || false; //是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。 默认是false
        this.Renderer.shadowMap.enabled = opt.shadowMapEnabled || false;//是否启用阴影
        this.Renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // this.Renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // this.Renderer.toneMappingExposure = 1;
        this.Renderer.outputEncoding = THREE.sRGBEncoding;
    }
}