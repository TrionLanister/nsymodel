/*
 * @Author: ChenLinMao
 * @Date: 2023-05-16 10:40:18
 * @LastEditors: ChenLinMao
 * @LastEditTime: 2023-05-23 15:48:09
 * @FilePath: \nsyModel\public\nsyModel\import\particle\index.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import * as THREE from "three";
import { sprayOpt, sprayItem } from "../../types/particle.d"
import { formatColor } from "../../utils/index"
import { spraySetting } from "./setting"
export default class Spray {
    sprayCount: number;//粒子数量
    sprayArr = new THREE.Group();//粒子存储
    sprayHeight: number = 3;
    velocities: any;//固定长度，用来存储浮点类型数据的数组,用来控制速度
    sprayItems: Array<sprayItem> = [];//配置项储存
    sprayTimer: any = null;//动画计时器
    spraySpeed: number = 0.02;//速度
    constructor(opt: sprayOpt) {
        let obj = spraySetting.filter((item) => item.level === opt.level);
        this.sprayCount = obj[0].sprayCount;
        this.spraySpeed = obj[0].spraySpeed;
        this.velocities = new Float32Array(this.sprayCount * 3);
        this.sprayItems = opt.sprayItems;
        this.sprayHeight = opt.sprayHeight;
    }
    initSpray() {
        for (let i = 0; i < this.sprayItems.length; i++) {
            let item = this.createSpray(this.sprayItems[i]);
            this.sprayArr.add(item);
        }
        this.sprayArr.name = 'sprayGroup';
        return this.sprayArr;
    }
    createSpray(row: sprayItem) {
        let particles = new THREE.BufferGeometry();
        let positions = new Float32Array(this.sprayCount * 3);
        for (var i = 0; i < this.sprayCount; i++) {
            let i3 = i * 3;
            positions[i3] = 0; // x
            positions[i3 + 1] = 0; // y
            positions[i3 + 2] = 0; // z
            // positions[i3] = row.positions.x; // x
            // positions[i3 + 1] = row.positions.y; // y
            // positions[i3 + 2] = row.positions.z; // z
            this.velocities[i3] = Math.random() * 0.02 - 0.01; // x velocity
            this.velocities[i3 + 1] = Math.random() * this.spraySpeed + this.spraySpeed * 2; // y velocity
            this.velocities[i3 + 2] = Math.random() * 0.04 - 0.02; // z velocity
        }
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('velocity', new THREE.BufferAttribute(this.velocities, 3));

        // 创建材质
        let particleMaterial = new THREE.PointsMaterial({
            color: formatColor(row.color),
            size: row.size
        });
        // 创建粒子对象
        let point = new THREE.Points(particles, particleMaterial);
        point.position.set(row.positions.x, row.positions.y, row.positions.z);
        return point;
    }
    sprayAnimateStart() {
        this.sprayTimer = setInterval(() => {
            let childs = this.sprayArr.children;
            for (let j = 0; j < childs.length; j++) {
                let obj3D: any = childs[j];
                let positions = obj3D.geometry.attributes.position.array;
                let velocities = obj3D.geometry.attributes.velocity.array;
                // obj3D.position.set(this.sprayItems[j].positions.x,this.sprayItems[j].positions.y,this.sprayItems[j].positions.z);
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] += velocities[i]; // x position
                    positions[i + 1] -= velocities[i + 1]; // y position
                    positions[i + 2] += velocities[i + 2]; // z position
                    if (positions[i + 1] < -this.sprayHeight) {
                        positions[i] = 0; // x
                        positions[i + 1] = 0; // y
                        positions[i + 2] = 0; // z
                        // positions[i] = this.sprayItems[j].positions.x; // x
                        // positions[i + 1] = this.sprayItems[j].positions.y; // y
                        // positions[i + 2] = this.sprayItems[j].positions.z; // z
                        velocities[i] = Math.random() * 0.036 - 0.018; // x velocity
                        velocities[i + 1] = Math.random() * this.spraySpeed + this.spraySpeed * 2; // y velocity
                        velocities[i + 2] = Math.random() * 0.04 - 0.02; // z velocity
                    }
                }
                obj3D.geometry.attributes.position.needsUpdate = true;
            }
        }, 10);
    }
    sprayAnimateStop() {
        clearInterval(this.sprayTimer);
        this.sprayTimer = null;
    }
    sprayRemove() {
        this.sprayAnimateStop();
        for (let i = 0; i < this.sprayArr.children.length; i++) {
            let o: any = this.sprayArr.children[i];
            o.geometry.dispose();
            o.material.dispose();
        }
        this.sprayArr.children = [];
    }
    spraySetLevel(level: number) {
        this.sprayRemove();
        let obj = spraySetting.filter((item) => item.level === level);
        this.sprayCount = obj[0].sprayCount;
        this.spraySpeed = obj[0].spraySpeed;
        this.velocities = new Float32Array(this.sprayCount * 3);
        for (let i = 0; i < this.sprayItems.length; i++) {
            let item = this.createSpray(this.sprayItems[i]);
            this.sprayArr.add(item);
        }
        this.sprayAnimateStart()
    }
}