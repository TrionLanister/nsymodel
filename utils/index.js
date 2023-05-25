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
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpGet = exports.vc3 = exports.formatColor = void 0;
/*
 * @Description:
 * @Version: 2.0
 * @Autor: CHENlm
 * @Date: 2023-03-24 14:28:43
 * @LastEditors: ChenLinMao
 * @LastEditTime: 2023-03-29 17:07:56
 */
const THREE = __importStar(require("three"));
const formatColor = (color) => {
    return new THREE.Color(color);
};
exports.formatColor = formatColor;
const vc3 = (tarX, y, z) => {
    if (tarX instanceof Object) {
        return new THREE.Vector3(tarX.x, tarX.y, tarX.z);
    }
    else {
        return new THREE.Vector3(tarX, y, z);
    }
};
exports.vc3 = vc3;
const httpGet = (url, option) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // console.log(xhr.responseText);
            }
            else {
                console.log(xhr.statusText);
            }
        };
        if (option) {
            xhr.responseType = option.responseType;
        }
        xhr.timeout = 100000;
        xhr.ontimeout = function (event) {
            reject("请求超时！");
            // alert('请求超时！');
        };
        xhr.onprogress = function updateProgress(event) {
            if (event.lengthComputable) {
                var percentComplete = event.loaded / event.total;
                // console.log('资源加载中：' + percentComplete);
            }
        };
        xhr.onloadstart = function () {
            // console.log("传输开始", 1);
        };
        xhr.onload = function (e) {
            // console.log("传输完成");
        };
        xhr.onloadend = function (e) {
            resolve(xhr.response);
            console.log("传输结束", typeof xhr.response);
        };
        xhr.onabort = function () {
            // console.log("用户取消");
        };
        xhr.onerror = function (e) {
            reject(e);
            console.log("error");
        };
        xhr.send();
    });
};
exports.httpGet = httpGet;
