import * as THREE from "three";
import { normalPos, weatherOpt } from "../../types";
function transferToNumber(inputNumber) {
    if (isNaN(inputNumber)) {
        return inputNumber;
    }
    inputNumber = '' + inputNumber;
    inputNumber = parseFloat(inputNumber);
    let eformat = inputNumber.toExponential();// 转换为标准的科学计数法形式（字符串）
    let tmpArray = eformat.match(/\d(?:\.(\d*))?e([+-]\d+)/);// 分离出小数值和指数值
    let number = inputNumber.toFixed(Math.max(0, (tmpArray[1] || '').length - tmpArray[2]));
    return number
}
export default class RainDrop {
    rainSize: number;
    rainSpeed: number;
    rainDrops: number;
    rainRange: normalPos;
    imgSrc: string;
    rainPosition: normalPos;
    autoRotate: boolean;
    geomCenter: any;
    texture: any;
    material: any;
    geom: any;
    velocityY: Array<any>;
    instance: any;
    rotaSpeed: any;
    rotaTimer: any;
    weatherOpt:weatherOpt;
    constructor(opt: weatherOpt) {
        this.weatherOpt = opt;
        this.rainSize = opt.rainSize || 10; //雨滴大小
        this.rainSpeed = transferToNumber(opt.rainSpeed / 10000); //雨下落速度
        this.rainDrops = opt.rainDrops || 5000; //雨量
        this.rainRange = opt.rainRange || { x: 50, y: 50, z: 50 }; //雨点下落范围
        this.imgSrc = opt.imgSrc || '/images/rain-drop.png'
        this.rainPosition = opt.rainPosition || { x: 0, y: 0, z: 0 }; // 雨场的位置		
        this.autoRotate = opt.autoRotate || false;//是否开启自动旋转
        this.geomCenter = new THREE.Vector3();
        this.texture = new THREE.TextureLoader().load(this.imgSrc);
        this.material = new THREE.PointsMaterial({ //用图片初始化顶点材质
            size: this.rainSize,
            map: this.texture,
            transparent: true
        })
        this.geom = new THREE.BufferGeometry();
        this.velocityY = [];
        this.instance = null;
        this.rotaSpeed = opt.rotaSpeed || 1;
        this.rotaTimer = null;
        this.init();
    }
    init() {
        this.geom = new THREE.BufferGeometry();
        this.velocityY = [];
        this.instance = null;
        //确定各个顶点的位置坐标
        let positions = this._randomVecArray(this.rainDrops)
        this.geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // this.instance = new THREE.Points(this.geom, this.material) //初始化粒子系统
        // this.instance.position.set(-697.486448938816, -99.9626281140977, -367.4061301633555)
        let points = new THREE.Points(this.geom, this.material);
        this.getCenterPoint(points);
        this.instance = this._changePivot(this.geomCenter.x, this.geomCenter.y, this.geomCenter.z, points);
        this.changeRPosition(this.rainPosition.x, this.rainPosition.y, this.rainPosition.z)
    }
    changeTexture(url:string){
        this.imgSrc = url;
        this.texture = new THREE.TextureLoader().load(this.imgSrc);
        this.instance.children[0].material.map = this.texture;
        if(!this.instance.visible) this.instance.visible = true;
    }
    getCenterPoint(mesh) {
        var geometry = mesh.geometry;
        geometry.computeBoundingBox();
        this.geomCenter.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
        this.geomCenter.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
        this.geomCenter.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
    }
    //通过x,y,z指定旋转中心，obj是要旋转的对象
    _changePivot(x, y, z, obj) {
        let wrapper = new THREE.Object3D();
        wrapper.position.set(x, y, z);
        wrapper.add(obj);
        obj.position.set(-x, -y, -z);
        wrapper.visible=this.weatherOpt.open;
        return wrapper;
    }
    _randomVecArray(drops, saveVelY = true) { // saveVelY:是否同时保存粒子速度到velocityY数组
        const positions: any = [];
        for (let i = 0; i < drops; i++) {
            positions.push(Math.random() * this.rainRange.x)
            positions.push(Math.random() * this.rainRange.y)
            positions.push(Math.random() * this.rainRange.z)
            if (saveVelY) this.velocityY.push(0.1 + Math.random() / 2) //初始化每个粒子的坐标和粒子在Y方向的速度
        }
        return positions
    }
    changeRPosition(x, y, z) {
        this.instance.translateX(x);
        this.instance.translateY(y);
        this.instance.translateZ(z);
    }
    changeRSize(size) {
        this.rainSize = size;
        this.instance.children[0].material.size = size
    }
    changeRSpeed(speed) {
        this.rainSpeed = speed;
    }
    deleteRain() { //删除雨滴
        this.geom.deleteAttribute('position');
    }
    changeRDrops(drops) {
        this.rainDrops = drops;
        this.deleteRain();
        let positions = this._randomVecArray(this.rainDrops)
        this.geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // this.instance.geometry.setAttribute('position', positions);
        // console.log(this.instance.geometry);
    }
    changeVisible(status) {
        this.instance.visible = status
    }
    downSpeed() {
        // if (this.rotaTimer) {
        //     this.instance.rotation.y += this.rotaSpeed / 1000;
        // } else {
        this.rotaSpeed = Math.floor(Math.random() * 5) + 1;
        this.instance.rotation.y += this.rotaSpeed / 1000;
        // clearTimeout(this.rotaTimer);
        // this.rotaTimer = null;
        // }
    }
    animate() {
        if (this.geom.attributes.position && this.geom.attributes.position.array) {
            const positions = this.geom.attributes.position.array;
            for (let i = 0; i < this.rainDrops * 3; i += 3) { //改变Y坐标，加速运动
                this.velocityY[i / 3] += Math.random() * this.rainSpeed;
                positions[i + 1] -= this.velocityY[i / 3]
                if (positions[i + 1] < -50) {
                    positions[i + 1] = 50
                    this.velocityY[i / 3] = 0.1 + Math.random() / 2
                }
            }
            // this.instance.scale.set(2, 2, 2);
            // this.geom.attributes.position.needsUpdate = true
            if (this.autoRotate) this.downSpeed()
            this.geom.attributes.position.needsUpdate = true
        }
    }
}
