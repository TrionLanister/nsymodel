/**
 * 封装的方法以及用法
 * 打开数据库
 */
export declare function openDB(dbName: string, storeName: string, version?: number): Promise<unknown>;
/**
 * 新增数据
 */
export declare function addData(db: any, storeName: string, data: any): Promise<unknown>;
/**
 * 通过主键读取数据
 */
export declare function getDataByKey(db: any, storeName: string, key: any): Promise<unknown>;
/**
 * 通过游标读取数据
 */
export declare function cursorGetData(db: any, storeName: string): Promise<unknown>;
/**
 * 通过索引读取数据
 */
export declare function getDataByIndex(db: any, storeName: string, indexName: string, indexValue: any): Promise<unknown>;
/**
 * 通过索引和游标查询记录
 */
export declare function cursorGetDataByIndex(db: any, storeName: string, indexName: string, indexValue: any): Promise<unknown>;
/**
 * 更新数据
 */
export declare function updateDB(db: any, storeName: string, data: any): Promise<unknown>;
/**
 * 删除数据
 */
export declare function deleteDB(db: any, storeName: string, id: any): Promise<unknown>;
/**
 * 删除数据库
 */
export declare function deleteDBAll(dbName: string): Promise<unknown>;
/**
 * 关闭数据库
 */
export declare function closeDB(db: any): void;
declare const _default: {
    openDB: typeof openDB;
    addData: typeof addData;
    getDataByKey: typeof getDataByKey;
    cursorGetData: typeof cursorGetData;
    getDataByIndex: typeof getDataByIndex;
    cursorGetDataByIndex: typeof cursorGetDataByIndex;
    updateDB: typeof updateDB;
    deleteDB: typeof deleteDB;
    deleteDBAll: typeof deleteDBAll;
    closeDB: typeof closeDB;
};
export default _default;
