"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrbitControls_js_1 = require("three/examples/jsm/controls/OrbitControls.js"); //控制器
class control {
    constructor(camera, ele, opt) {
        this.conOpt = {
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
        this.conOpt = Object.assign(Object.assign({}, this.conOpt), opt);
        this.Control = new OrbitControls_js_1.OrbitControls(camera, ele);
        this.setProp();
        if (this.conOpt.onChange)
            this.onChange();
        if (this.conOpt.onStart)
            this.onStart();
        if (this.conOpt.onEnd)
            this.onEnd();
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
    setTarget(position) {
        this.Control.target = position;
    }
    getTarget() {
        return this.Control.target;
    }
    onChange() {
        this.Control.addEventListener('change', () => {
            this.conOpt.onChange && this.conOpt.onChange(this.Control);
        });
    }
    onStart() {
        this.Control.addEventListener('start', () => {
            this.conOpt.onStart && this.conOpt.onStart(this.Control);
        });
    }
    onEnd() {
        this.Control.addEventListener('end', () => {
            this.conOpt.onEnd && this.conOpt.onEnd(this.Control);
        });
    }
}
exports.default = control;
