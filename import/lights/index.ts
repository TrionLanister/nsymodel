/*
 * @Description: 
 * @Version: 2.0
 * @Autor: CHENlm
 * @Date: 2023-03-24 15:53:20
 * @LastEditors: CHENlm
 * @LastEditTime: 2023-03-25 13:55:42
 */
import { ambientLi, directionalLi, pointLi, hemisphereLi, spotLi, lightsOpt } from "../../types/index";
import nsyAuth from "../auth"
import * as THREE from "three";
import { formatColor } from "../../utils";
export default class lights {
    ambientLight: any;//环境光
    directionalLights: any = [];//平行光
    pointLights: any = [];//点光源
    hemisphereLight: any;//半球光
    spotLights: any = [];//聚光灯
    constructor(opt: lightsOpt) {
        // const ST = new nsyAuth().authLights(opt)
        // if (ST !== 'success') {
        //     alert(ST);
        //     return;
        // }
        if (opt.ambientLight) this.createAmbient(opt.ambientLight);
        if (opt.directionalLights) this.createDirectional(opt.directionalLights);
        if (opt.pointLights) this.createPoint(opt.pointLights);
        if (opt.hemisphereLight) this.createHemisphere(opt.hemisphereLight);
        if (opt.spotLights) this.createSpot(opt.spotLights);
    }
    createAmbient(light: ambientLi) {
        this.ambientLight = new THREE.AmbientLight(formatColor(light.color), light.intensity);
    }
    createDirectional(lights: directionalLi[]) {
        for (let i = 0; i < lights.length; i++) {
            let item = lights[i];
            let direct = new THREE.DirectionalLight(formatColor(item.color), item.intensity) //光源设置
            if (item.position) direct.position.set(item.position.x, item.position.y, item.position.z);
            item.castShadow&&(direct.castShadow = item.castShadow)
            this.directionalLights.push(direct)
        }
    }
    createPoint(lights: pointLi[]) {
        for (let i = 0; i < lights.length; i++) {
            let item = lights[i];
            let point = new THREE.PointLight(formatColor(item.color), item.intensity, item.distance, item.decay) //光源设置
            if (item.position) point.position.set(item.position.x, item.position.y, item.position.z);
            item.castShadow&&(point.castShadow = item.castShadow)
            this.pointLights.push(point)
        }
    }
    createHemisphere(light: hemisphereLi) {
        this.hemisphereLight = new THREE.HemisphereLight(formatColor(light.skyColor),formatColor(light.groundColor), light.intensity);
        if (light.position) this.hemisphereLight.position.set(light.position.x, light.position.y, light.position.z);
    }
    createSpot(lights: spotLi[]) {
        for (let i = 0; i < lights.length; i++) {
            let item = lights[i];
            let spot = new THREE.SpotLight(formatColor(item.color), item.intensity, item.distance, item.angle, item.penumbra, item.decay) //光源设置
            if (item.position) spot.position.set(item.position.x, item.position.y, item.position.z);
            item.castShadow&&(spot.castShadow = item.castShadow)
            this.spotLights.push(spot)
        }
    }
}