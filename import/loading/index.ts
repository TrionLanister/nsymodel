/*
 * @Description: 
 * @Version: 2.0
 * @Autor: CHENlm
 * @Date: 2023-03-26 18:57:10
 * @LastEditors: ChenLinMao
 * @LastEditTime: 2023-03-28 16:42:13
 */
import { Loading } from "../../types"
import TWEEN from '@tweenjs/tween.js'
export default class loading {
  tween: any;
  parentdDom: any = document.getElementsByTagName('body')[0];
  lodOpt: Loading;
  progress: number;
  constructor(parameters: Loading, dom?: any) {
    this.lodOpt = parameters;
    this.progress = 0;
    this.createDom();
    if (!this.lodOpt.apBody) this.parentdDom = dom;
  }
  parseDom(arg: string) {
    let objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.childNodes;
  };
  createDom() {
    const dom = '<div style="display:block; position: fixed;top: 0;bottom: 0;left: 0;right: 0;background-color: rgba(0, 0, 0, .85);z-index: 999999;" id="nsy_loading">' +
      '<div style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);">' +
      '<p style="color: #f2f2f2;font-size: 16px;width: 100%;text-align: center;"> 页面加载中.....<span style="color: #f05;display:inline-block;margin-left:35px;" id="nsy_Loading_span">' +
      this.progress + '%</span></p>' +
      '<div style="width: 300px;height: 20px;background-color: #f2f2f2;overflow: hidden;border-radius: 3px;margin:0 auto;">' +
      '<div id="nsy_Loading_pro" style="width: 0%;height: 100%;background-color: darkturquoise;"></div>' +
      '</div>' +
      '<p style="color: #cfcfcf;font-size: 13px;width: 100%;text-align: center;"> 模型首次加载和网速相关，请耐心等待</p>' +
      '<p style="color: #cfcfcf;font-size: 13px;width: 100%;text-align: center;"> 成功加载一次之后，下次加载将会大幅提升加载速度（仅支持主流浏览器）</p>' +
      '</div>' +
      '</div>';
    let nodes = this.parseDom(dom);
    this.parentdDom.appendChild(nodes[0]);
  }
  showLoading(isReset: boolean = true) {
    if (isReset) this.progress = 0;
    this.changeProg(this.progress, 200, () => {
      document.getElementById("nsy_loading")!.style.display = 'block';
    });
  }
  hideLoading(isFull: boolean = true) {
    if (isFull) this.progress = 100;
    this.changeProg(this.progress, 1200, () => {
      document.getElementById("nsy_loading")!.style.display = 'none';
    });
  }
  changeProg(pros: number, delay: number = 3000, callback?: Function) {
    let span = document.getElementById("nsy_Loading_span") as HTMLElement, prs = document.getElementById("nsy_Loading_pro") as HTMLElement;
    if (!this.lodOpt.open || !span || !prs) return;
    if (pros > 100 || pros < 0) { alert('进度数值错误！'); return; }
    if (this.tween && this.tween.isPlaying) {
      this.tween.stop()
      this.tween.pause()
    }
    this.tween = new TWEEN.Tween({
      p: this.progress
    }).easing(TWEEN.Easing.Cubic.InOut).to({
      p: pros
    }, delay).onUpdate((pos) => {
      let n = pos.p.toFixed(2);
      span.innerHTML = n + '%';
      prs.style.width = n + '%';
    }).start().onComplete(() => {
      this.progress = pros;
      callback && callback()
    })
  }
}