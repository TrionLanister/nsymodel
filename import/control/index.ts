/*
 * @Author: ChenLinMao
 * @Date: 2023-03-23 15:59:36
 * @LastEditors: CHENlm
 * @LastEditTime: 2023-03-25 23:55:21
 * @FilePath: \nsyModel\public\nsyModel\import\control\index.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { controlOpt } from "../../types"
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js"; //控制器
import { Camera, Vector3 } from "three";
export default class control {
    Control: any;
    conOpt: controlOpt = {
        autoRotate: true,
        autoRotateSpeed: 0.5,
        enableDamping: false,
        dampingFactor: 0.1,
        enableRotate: true,
        enableZoom: true,
        minPolarAngle: 0,
        maxPolarAngle: Math.PI,
        // minAzimuthAngle :  -Math.PI * (100 / 180),
        // maxAzimuthAngle :  Math.PI * (100 / 180),
        minDistance: 0,
        maxDistance: Infinity,
        enablePan: true
    };
    constructor(camera: Camera, ele: HTMLElement, opt?: controlOpt) {
        this.conOpt = { ...this.conOpt, ...opt };
        this.Control = new OrbitControls(camera, ele);
        this.setProp()
        if (this.conOpt.onChange) this.onChange();
        if (this.conOpt.onStart) this.onStart();
        if (this.conOpt.onEnd) this.onEnd();

    }
    setProp() {
        this.Control.autoRotate = this.conOpt.autoRotate;
        this.Control.autoRotateSpeed = this.conOpt.autoRotateSpeed;
        this.Control.enableDamping = this.conOpt.enableDamping;
        this.Control.dampingFactor = this.conOpt.dampingFactor;
        this.Control.enableRotate = this.conOpt.enableRotate;
        this.Control.enableZoom = this.conOpt.enableZoom;
        this.Control.minPolarAngle = this.conOpt.minPolarAngle;
        this.Control.maxPolarAngle = this.conOpt.maxPolarAngle;
        // this.Control.minAzimuthAngle =this.conOpt.minAzimuthAngle;
        // this.Control.maxAzimuthAngle = this.conOpt.maxAzimuthAngle;
        this.Control.minDistance = this.conOpt.minDistance;
        this.Control.maxDistance = this.conOpt.maxDistance;
        this.Control.enablePan = this.conOpt.enablePan;
    }
    setTarget(position: Vector3) {
        this.Control.target = position;
    }
    getTarget(){
        return this.Control.target
    }
    onChange() {
        this.Control.addEventListener('change', () => {
            this.conOpt.onChange && this.conOpt.onChange(this.Control);
        })
    }
    onStart() {
        this.Control.addEventListener('start', () => {
            this.conOpt.onStart && this.conOpt.onStart(this.Control);
        })
    }
    onEnd() {
        this.Control.addEventListener('end', () => {
            this.conOpt.onEnd && this.conOpt.onEnd(this.Control);
        })
    }
    
}