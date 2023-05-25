"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class camera {
    constructor(obj, parameters) {
        this.cameraOpt = {
            fov: 45,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 1000,
            position: { x: 0, y: 10, z: 0 },
            target: { x: 0, y: 0, z: 0 }
        };
        this.Camera = obj;
        this.cameraOpt = Object.assign(Object.assign({}, this.cameraOpt), parameters);
        this.setPos();
        this.setTar();
    }
    sizeChange(width, height) {
        let num = width / height;
        this.Camera.aspect = num;
        this.cameraOpt.aspect = num;
        this.Camera.updateProjectionMatrix();
    }
    setPos(pos) {
        var _a, _b, _c;
        if (pos) {
            this.Camera.position.set(pos.x, pos.y, pos.z);
            return;
        }
        this.Camera.position.set((_a = this.cameraOpt.position) === null || _a === void 0 ? void 0 : _a.x, (_b = this.cameraOpt.position) === null || _b === void 0 ? void 0 : _b.y, (_c = this.cameraOpt.position) === null || _c === void 0 ? void 0 : _c.z);
    }
    getPos() {
        return this.Camera.position;
    }
    setTar(pos) {
        var _a, _b, _c;
        if (pos) {
            this.Camera.lookAt(pos.x, pos.y, pos.z);
            return;
        }
        this.Camera.lookAt((_a = this.cameraOpt.target) === null || _a === void 0 ? void 0 : _a.x, (_b = this.cameraOpt.target) === null || _b === void 0 ? void 0 : _b.y, (_c = this.cameraOpt.target) === null || _c === void 0 ? void 0 : _c.z);
    }
    getTar() {
        return this.Camera.target;
    }
}
exports.default = camera;
