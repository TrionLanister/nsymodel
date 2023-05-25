/*
 * @Author: ChenLinMao
 * @Date: 2023-03-30 09:18:10
 * @LastEditors: ChenLinMao
 * @LastEditTime: 2023-04-27 15:52:27
 * @FilePath: \nsyModel\public\nsyModel\import\label\index.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import html2canvas from 'html2canvas';
import * as THREE from "three";
import { Mesh } from 'three';
import {
    CSS2DRenderer,
    CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import { labelOpt } from '../../types/label';
export default class label {
    label: any;
    labelOpt: any;
    spriteLabel: any = [];
    constructor(params?: any) {
        // for(let i = 0;i<5;i++){
        //     this.spriteLabel.push(this.createSpriteShape())
        // }
    }
    async createSpriteShape(domStr: string, opt: labelOpt) {
        const group = new THREE.Group()
        let dom = document.getElementById("nsyLabelDom"), mesh: any;
        if (!dom) {
            dom = document.createElement("div");
            dom.id = 'nsyLabelDom';
            document.getElementsByTagName("body")[0].appendChild(dom);
        }
        dom.style.position = 'fixed';
        dom.style.left = '-100%';
        dom.style.top = '-100%';
        dom.innerHTML = domStr;
        await html2canvas(document.getElementById(opt.id) as any, { backgroundColor: null }).then((canvas) => {
            let img = canvas.toDataURL("image/png");//已经转化了img
            // console.log(img);
            let texture = new THREE.TextureLoader().load(img);
            texture.needsUpdate = true; //注意
            let material = new THREE.SpriteMaterial({ map: texture, transparent: true });
            mesh = new THREE.Sprite(material);
            mesh.scale.set(opt.scale.x, opt.scale.y, opt.scale.z);
            mesh.position.set(opt.position.x, opt.position.y, opt.position.z);
            mesh.userData.CameraPosition = opt.cameraPosition;
            mesh.userData.TargetPosition =  opt.position
            if (opt.closeBtn) {
                let closeTexture = new THREE.TextureLoader().load(opt.closeBtn.url);
                closeTexture.needsUpdate = true;
                let closeMaterial = new THREE.SpriteMaterial({ map: closeTexture, transparent: true });
                let closeMesh = new THREE.Sprite(closeMaterial);
                closeMesh.scale.set(1/opt.scale.x*opt.closeBtn.scale.x, 1/opt.scale.y*opt.closeBtn.scale.y, 1/opt.scale.z*opt.closeBtn.scale.z);// 由于添加进主label中后会随之一起缩放，导致btn图变形，1除主label的缩放比之后可还原
                closeMesh.center.set(opt.closeBtn.center.x,opt.closeBtn.center.y);
                closeMesh.userData.type='labelClose';
                mesh.add(closeMesh);
            }
            if(opt.openBtn){
                let openTexture = new THREE.TextureLoader().load(opt.openBtn.url);
                openTexture.needsUpdate = true;
                let openMaterial = new THREE.SpriteMaterial({ map: openTexture, transparent: true });
                let openMesh = new THREE.Sprite(openMaterial);
                openMesh.scale.set(opt.openBtn.scale.x, opt.openBtn.scale.y, opt.openBtn.scale.z);// 由于添加进主label中后会随之一起缩放，导致btn图变形，1除主label的缩放比之后可还原
                openMesh.position.set(opt.openBtn.position.x,opt.openBtn.position.y,opt.openBtn.position.z);
                openMesh.userData.type='labelOpen';
                openMesh.visible =false;
                group.add(openMesh)
            }
            mesh.userData.id = opt.id;
            group.add(mesh);
            dom?.remove()
        });
        return group;
    }
    async updateSpriteShape(domStr: string,id, sprite:any) {
        let dom = document.getElementById("nsyLabelDom");
        if (!dom) {
            dom = document.createElement("div");
            dom.id = 'nsyLabelDom';
            document.getElementsByTagName("body")[0].appendChild(dom);
        }
        dom.style.position = 'fixed';
        dom.style.left = '-100%';
        dom.style.top = '-100%';
        dom.innerHTML = domStr;
        await html2canvas(document.getElementById(id) as any, { backgroundColor: null }).then((canvas) => {
            let img = canvas.toDataURL("image/png");//已经转化了img
            // console.log(img);
            let texture = new THREE.TextureLoader().load(img);
            texture.needsUpdate = true; //注意
            let material = new THREE.SpriteMaterial({ map: texture, transparent: true });
            sprite.material = material;
            dom?.remove()
        });
    }
    createLabel2DWrap(dom: string) {
        let node = document.querySelector('.labelWrap');
        if (node) {
            return
        }
        let labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(document.getElementById(dom)!.clientWidth, document.getElementById(dom)!.clientHeight);
        labelRenderer.domElement.className = 'labelWrap';
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = "0";
        document.getElementById(dom)!.appendChild(labelRenderer.domElement);
        return labelRenderer;
    }
}