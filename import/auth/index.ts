/*
 * @Description: 
 * @Version: 2.0
 * @Autor: CHENlm
 * @Date: 2023-03-22 18:12:51
 * @LastEditors: CHENlm
 * @LastEditTime: 2023-03-25 13:55:43
 */

import { iniOpt,lightsOpt} from "../../types/options"
class InitOpt {
    msg='success';
    constructor(opt:iniOpt){
        this.msg;
        if(opt===undefined){
            this.msg = '模型场景配置项未找到！'; 
        }else{
            if(!opt.dom){
                this.msg = 'DOM元素缺失，请确认传入的DOM'
            }
        }
    }
}
class authLight {
    msg = 'success'
    constructor(opt:lightsOpt){
        this.msg;
        if(opt===undefined||!opt.ambientLight){
            this.msg = '请至少在场景中加入一种光源'; 
        }
    }
}
export default class nsyAuth{
    InitOpt(opt:any){
      return  new InitOpt(opt).msg
    }
    authLights(opt:any){
        return new authLight(opt).msg
    }
}