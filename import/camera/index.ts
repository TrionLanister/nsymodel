/*
 * @Description: 
 * @Version: 2.0
 * @Autor: CHENlm
 * @Date: 2023-03-24 14:19:42
 * @LastEditors: CHENlm
 * @LastEditTime: 2023-03-25 23:48:42
 */
import { cameraOpt } from "../../types";
import { vc3 } from "../../utils";

export default class camera {
    Camera;
    cameraOpt: cameraOpt = {
        fov: 45,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000,
        position: {x:0,y:10,z:0},
        target: {x:0,y:0,z:0}
    };
    constructor(obj: any, parameters?: cameraOpt) {
        this.Camera = obj;
        this.cameraOpt = {...this.cameraOpt, ...parameters };
        this.setPos()
        this.setTar()
    }
    sizeChange(width: number, height: number) {
        let num = width / height;
        this.Camera.aspect = num;
        this.cameraOpt.aspect = num;
        this.Camera.updateProjectionMatrix();
    }
    setPos(pos?:any) {
        if (pos) {
            this.Camera.position.set(pos.x, pos.y, pos.z);
            return;
        }
        this.Camera.position.set(this.cameraOpt.position?.x,this.cameraOpt.position?.y,this.cameraOpt.position?.z)
    }
    getPos(){
        return this.Camera.position
    }
    setTar(pos?:any) {
        if (pos) {
            this.Camera.lookAt(pos.x, pos.y, pos.z);
            return;
        }
        this.Camera.lookAt(this.cameraOpt.target?.x,this.cameraOpt.target?.y,this.cameraOpt.target?.z );
    }
    getTar(){
        return this.Camera.target
    }
}