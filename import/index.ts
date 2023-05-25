/*
 * @Author: ChenLinMao
 * @Date: 2023-03-22 09:28:43
 * @LastEditors: ChenLinMao
 * @LastEditTime: 2023-03-30 09:39:12
 * @FilePath: \nsyModel\public\nsyModel\import\index.ts
 * @Description: 多向引入
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import * as THREE from "three";
import nsyAuth from "./auth";
import scene from "./scene";
import render from "./render";
import camera from "./camera";
import lights from "./lights";
import control from "./control";
import loading from "./loading";
import label from "./label";
import weather from "./weather"
export function useCommon() {
    const NSYTHR = THREE;
    const Auth = new nsyAuth();
    const nsyScene = scene;
    const nsyRender = render;
    const nsyCamera = camera;
    const nsyLights = lights;
    const nsyControl = control;
    const nsyLoading = loading;
    const nsyLabel = label;
    const nsyWeather = weather;
    return {
        NSYTHR,
        Auth,
        nsyScene,
        nsyRender,
        nsyCamera,
        nsyLights,
        nsyControl,
        nsyLoading,
        nsyLabel,
        nsyWeather
    };
}