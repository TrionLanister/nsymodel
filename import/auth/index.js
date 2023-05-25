"use strict";
/*
 * @Description:
 * @Version: 2.0
 * @Autor: CHENlm
 * @Date: 2023-03-22 18:12:51
 * @LastEditors: CHENlm
 * @LastEditTime: 2023-03-25 13:55:43
 */
Object.defineProperty(exports, "__esModule", { value: true });
class InitOpt {
    constructor(opt) {
        this.msg = 'success';
        this.msg;
        if (opt === undefined) {
            this.msg = '模型场景配置项未找到！';
        }
        else {
            if (!opt.dom) {
                this.msg = 'DOM元素缺失，请确认传入的DOM';
            }
        }
    }
}
class authLight {
    constructor(opt) {
        this.msg = 'success';
        this.msg;
        if (opt === undefined || !opt.ambientLight) {
            this.msg = '请至少在场景中加入一种光源';
        }
    }
}
class nsyAuth {
    InitOpt(opt) {
        return new InitOpt(opt).msg;
    }
    authLights(opt) {
        return new authLight(opt).msg;
    }
}
exports.default = nsyAuth;
