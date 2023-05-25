export interface sprayItem{
    color:string;//水滴颜色，默认白色
    size:number;//水滴尺寸
    positions:any;//喷淋头位置
}
export interface sprayOpt{
    level:number;//雨量等级0-5
    sprayHeight:number;//从喷淋头顶部算起，到水滴滴落的高度
    sprayItems:Array<sprayItem>;
}