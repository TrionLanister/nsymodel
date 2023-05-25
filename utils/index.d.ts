import * as THREE from "three";
interface targetPos {
    x: number;
    y: number;
    z: number;
}
export declare const formatColor: (color: any) => THREE.Color;
export declare const vc3: (tarX?: number | targetPos, y?: number, z?: number) => THREE.Vector3;
export declare const httpGet: (url: string, option?: any) => Promise<unknown>;
export {};
