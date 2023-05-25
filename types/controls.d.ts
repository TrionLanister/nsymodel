/*
 * @Author: ChenLinMao
 * @Date: 2023-03-23 15:32:33
 * @LastEditors: ChenLinMao
 * @LastEditTime: 2023-03-23 15:33:36
 * @FilePath: \nsyModel\public\nsyModel\types\controls.d.ts
 * @Description: 控制器相关声明
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
export interface controlOpt {
    //自动旋转
    autoRotate?: boolean,
    // 自动旋转速度
    autoRotateSpeed?: number,
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    enableDamping?:boolean,
    // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
    dampingFactor?: number,
    // 是否可以旋转
    enableRotate?: boolean,
    // 是否可以缩放与缩小
    enableZoom?: boolean,
    // 上下旋转范围
    minPolarAngle?:number,
    maxPolarAngle?: number,
    // 左右旋转范围
    minAzimuthAngle ?:number,
    maxAzimuthAngle ?: number,
    // 设置相机距离原点的最近距离
    minDistance ?: number,
    // 设置相机距离原点的最远距离
    maxDistance ?:number,
    // 是否开启右键拖拽
    enablePan?: boolean,
    // 是否开启监听->在控件状态改变的过程中时
    onChange?:Function,
    // 是否开启监听->在控件状态改变的开始时
    onStart?:Function,
    // 是否开启监听->在控件状态改变的结束时
    onEnd?:Function,
}