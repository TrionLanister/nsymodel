import * as THREE from "three";
import { sprayOpt, sprayItem } from "../../types/particle.d";
export default class Spray {
    sprayCount: number;
    sprayArr: THREE.Group;
    sprayHeight: number;
    velocities: any;
    sprayItems: Array<sprayItem>;
    sprayTimer: any;
    spraySpeed: number;
    constructor(opt: sprayOpt);
    initSpray(): THREE.Group;
    createSpray(row: sprayItem): THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
    sprayAnimateStart(): void;
    sprayAnimateStop(): void;
    sprayRemove(): void;
    spraySetLevel(level: number): void;
}
