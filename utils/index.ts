/*
 * @Description: 
 * @Version: 2.0
 * @Autor: CHENlm
 * @Date: 2023-03-24 14:28:43
 * @LastEditors: ChenLinMao
 * @LastEditTime: 2023-03-29 17:07:56
 */
import * as THREE from "three";
interface targetPos {
    x:number,
    y:number,
    z:number
}
export const formatColor = (color: any) => { // 格式化颜色
    return new THREE.Color(color)
}
export const vc3 = (tarX?: number|targetPos, y?: number, z?: number) => { // 格式化三维向量
    if(tarX instanceof Object){
        return new THREE.Vector3(tarX.x, tarX.y, tarX.z)
    }else{
        return new THREE.Vector3(tarX, y, z)
    }
}

export const httpGet = (url: string,option?:any) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // console.log(xhr.responseText);
            } else {
                console.log(xhr.statusText);
            }
        };
        if(option){
            xhr.responseType = option.responseType;
        }
        xhr.timeout = 100000;
        xhr.ontimeout = function (event) {
            reject("请求超时！")
            // alert('请求超时！');
        }
        xhr.onprogress = function updateProgress(event) {
            if (event.lengthComputable) {
                var percentComplete = event.loaded / event.total;
                // console.log('资源加载中：' + percentComplete);
            }
        }
        xhr.onloadstart = function () {
            // console.log("传输开始", 1);
        };
        xhr.onload = function (e) {
            // console.log("传输完成");
        };
        xhr.onloadend = function (e) {
            resolve(xhr.response)
            console.log("传输结束", typeof xhr.response);
        };
        xhr.onabort = function () {
            // console.log("用户取消");
        };
        xhr.onerror = function (e) {
            reject(e)
            console.log("error");
        };
        xhr.send();
    })

}