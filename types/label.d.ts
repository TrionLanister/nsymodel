import { normalPos } from "./options"
export interface labelOpt{
    id:string,
    position:normalPos,
    scale:normalPos,
    closeBtn?:labelClose,
    openBtn?:labelClose,
    cameraPosition:normalPos
}
export interface labelClose {
    url:string,
    center:normalPos,
    position:normalPos,
    scale:normalPos,
}