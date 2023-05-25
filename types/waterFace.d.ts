import { Color } from "three";
interface planeSize {
    width:number,
    height:number
}
export interface faceOption {// 配置项
    textureWidth?:number;//贴图宽
    textureHeight?:number;//贴图高
    waterNormalsUrl?:string;//贴图url
    alpha?:number;//水面透明度
    sunColor?:Color;//阳光颜色
    waterColor?:Color;//水面颜色
    distortionScale?:number;//失真比例
    position?:any;//水面位置
    size:planeSize
}