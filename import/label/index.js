"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const html2canvas_1 = __importDefault(require("html2canvas"));
const THREE = __importStar(require("three"));
const CSS2DRenderer_1 = require("three/examples/jsm/renderers/CSS2DRenderer");
class label {
    constructor(params) {
        this.spriteLabel = [];
        // for(let i = 0;i<5;i++){
        //     this.spriteLabel.push(this.createSpriteShape())
        // }
    }
    createSpriteShape(domStr, opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = new THREE.Group();
            let dom = document.getElementById("nsyLabelDom"), mesh;
            if (!dom) {
                dom = document.createElement("div");
                dom.id = 'nsyLabelDom';
                document.getElementsByTagName("body")[0].appendChild(dom);
            }
            dom.style.position = 'fixed';
            dom.style.left = '-100%';
            dom.style.top = '-100%';
            dom.innerHTML = domStr;
            yield (0, html2canvas_1.default)(document.getElementById(opt.id), { backgroundColor: null }).then((canvas) => {
                let img = canvas.toDataURL("image/png"); //已经转化了img
                // console.log(img);
                let texture = new THREE.TextureLoader().load(img);
                texture.needsUpdate = true; //注意
                let material = new THREE.SpriteMaterial({ map: texture, transparent: true });
                mesh = new THREE.Sprite(material);
                mesh.scale.set(opt.scale.x, opt.scale.y, opt.scale.z);
                mesh.position.set(opt.position.x, opt.position.y, opt.position.z);
                mesh.userData.CameraPosition = opt.cameraPosition;
                mesh.userData.TargetPosition = opt.position;
                if (opt.closeBtn) {
                    let closeTexture = new THREE.TextureLoader().load(opt.closeBtn.url);
                    closeTexture.needsUpdate = true;
                    let closeMaterial = new THREE.SpriteMaterial({ map: closeTexture, transparent: true });
                    let closeMesh = new THREE.Sprite(closeMaterial);
                    closeMesh.scale.set(1 / opt.scale.x * opt.closeBtn.scale.x, 1 / opt.scale.y * opt.closeBtn.scale.y, 1 / opt.scale.z * opt.closeBtn.scale.z); // 由于添加进主label中后会随之一起缩放，导致btn图变形，1除主label的缩放比之后可还原
                    closeMesh.center.set(opt.closeBtn.center.x, opt.closeBtn.center.y);
                    closeMesh.userData.type = 'labelClose';
                    mesh.add(closeMesh);
                }
                if (opt.openBtn) {
                    let openTexture = new THREE.TextureLoader().load(opt.openBtn.url);
                    openTexture.needsUpdate = true;
                    let openMaterial = new THREE.SpriteMaterial({ map: openTexture, transparent: true });
                    let openMesh = new THREE.Sprite(openMaterial);
                    openMesh.scale.set(opt.openBtn.scale.x, opt.openBtn.scale.y, opt.openBtn.scale.z); // 由于添加进主label中后会随之一起缩放，导致btn图变形，1除主label的缩放比之后可还原
                    openMesh.position.set(opt.openBtn.position.x, opt.openBtn.position.y, opt.openBtn.position.z);
                    openMesh.userData.type = 'labelOpen';
                    openMesh.visible = false;
                    group.add(openMesh);
                }
                mesh.userData.id = opt.id;
                group.add(mesh);
                dom === null || dom === void 0 ? void 0 : dom.remove();
            });
            return group;
        });
    }
    updateSpriteShape(domStr, id, sprite) {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield (0, html2canvas_1.default)(document.getElementById(id), { backgroundColor: null }).then((canvas) => {
                let img = canvas.toDataURL("image/png"); //已经转化了img
                // console.log(img);
                let texture = new THREE.TextureLoader().load(img);
                texture.needsUpdate = true; //注意
                let material = new THREE.SpriteMaterial({ map: texture, transparent: true });
                sprite.material = material;
                dom === null || dom === void 0 ? void 0 : dom.remove();
            });
        });
    }
    createLabel2DWrap(dom) {
        let node = document.querySelector('.labelWrap');
        if (node) {
            return;
        }
        let labelRenderer = new CSS2DRenderer_1.CSS2DRenderer();
        labelRenderer.setSize(document.getElementById(dom).clientWidth, document.getElementById(dom).clientHeight);
        labelRenderer.domElement.className = 'labelWrap';
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = "0";
        document.getElementById(dom).appendChild(labelRenderer.domElement);
        return labelRenderer;
    }
}
exports.default = label;
