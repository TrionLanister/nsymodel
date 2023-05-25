import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { labelOpt } from '../../types/label';
export default class label {
    label: any;
    labelOpt: any;
    spriteLabel: any;
    constructor(params?: any);
    createSpriteShape(domStr: string, opt: labelOpt): Promise<THREE.Group>;
    updateSpriteShape(domStr: string, id: any, sprite: any): Promise<void>;
    createLabel2DWrap(dom: string): CSS2DRenderer;
}
