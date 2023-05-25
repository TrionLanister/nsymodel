import * as THREE from "three";
import {
    Water
} from 'three/examples/jsm/objects/Water.js';
import { faceOption } from "../../types/waterFace.d";
import { formatColor } from "../../utils/index"
export const water = (option: faceOption) => {
    let defaultOption:any = {
        textureWidth: 512,
        textureHeight: 512,
        alpha: 0.7,
        sunColor: formatColor('#fff'),
        waterColor: formatColor('#1484e7'),
        distortionScale: 2,
        waterNormalsUrl: 'nsymodel/import/waterFace/waternormals.jpg',
        position: { x: 0, y: 0, z: 0 },
        size:{
            width:10,
            height:10
        }
    }
    defaultOption = { ...option };
    let setting = {
        ...defaultOption, waterNormals: new THREE.TextureLoader().load(defaultOption.waterNormalsUrl, (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        })
    }
    let geometry = new THREE.PlaneGeometry(setting.size.width, setting.size.height);
    let water = new Water(geometry, setting);
    if (setting.position) {
        water.position.set(setting.position.x, setting.position.y, setting.position.z);
    }
    water.rotation.x = - Math.PI / 2;
    return water
}
