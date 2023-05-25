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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCommon = void 0;
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
const THREE = __importStar(require("three"));
const auth_1 = __importDefault(require("./auth"));
const scene_1 = __importDefault(require("./scene"));
const render_1 = __importDefault(require("./render"));
const camera_1 = __importDefault(require("./camera"));
const lights_1 = __importDefault(require("./lights"));
const control_1 = __importDefault(require("./control"));
const loading_1 = __importDefault(require("./loading"));
const label_1 = __importDefault(require("./label"));
const weather_1 = __importDefault(require("./weather"));
function useCommon() {
    const NSYTHR = THREE;
    const Auth = new auth_1.default();
    const nsyScene = scene_1.default;
    const nsyRender = render_1.default;
    const nsyCamera = camera_1.default;
    const nsyLights = lights_1.default;
    const nsyControl = control_1.default;
    const nsyLoading = loading_1.default;
    const nsyLabel = label_1.default;
    const nsyWeather = weather_1.default;
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
exports.useCommon = useCommon;
