let request, db, dbName = 'default',
    storeName = 'defaultStore',
    indexedDB,
    dbVersion = 1.0;
let witDB = {
    request: '',
    db: '',
    dbName: 'default',
    storeName: 'defaultStore',
    indexedDB: '',
    dbVersion: 1.0,
    deleteDB: null,
    openDB: null,
    setDB: null,
    againDB: null,
    getDB: null,
    delDB: null
};
(function () { //默认创建数据库default - defaultStore
    witDB.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB ||
        window
            .msIndexedDB,
        IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction ||
            window
                .msIDBTransaction;
    if (!witDB.db) {
        witDB.openDB(witDB.dbName, witDB.storeName, witDB.dbVersion)
    }
})();

witDB.deleteDB = (dbName) => {
    let req = witDB.indexedDB.deleteDatabase(dbName);
    return new Promise((resolve, reject) => {
        req.onsuccess = function () {
            resolve(true)
            console.log("Deleted database successfully");
        };
        req.onerror = function () {
            reject(false)
            console.log("Couldn't delete database");
        };
        req.onblocked = function () {
            console.log("Couldn't delete database due to the operation being blocked");
        };
    })

}

witDB.openDB = (dbName, storeName, version = 1) => {
    witDB.request = witDB.indexedDB.open(dbName, version)
    console.log(witDB.request)
    witDB.request.onsuccess = function (event) {
        console.log(event)
        witDB.db = event.target.result // 数据库对象
        console.log(`${dbName}-${storeName},版本:${version} 创建成功！`)
    }
    witDB.request.onerror = function (event) {
        console.log(`${dbName}-${storeName},版本:${version} 创建失败！`)
    }

    witDB.request.onupgradeneeded = function (event) {
        // 数据库创建或升级的时候会触发
        console.log(event)
        witDB.db = event.target.result // 数据库对象
        let objectStore
        if (!witDB.db.objectStoreNames.contains(storeName)) {
            objectStore = witDB.db.createObjectStore(storeName) // 创建表
            // objectStore.createIndex('name', 'name', { unique: true }) // 创建索引 可以让你搜索任意字段
        }
    }
}

witDB.againDB = (againDBName, againVersion) => { //重新打开DB
    return new Promise((resolve, reject) => {
        witDB.dbName = againDBName ? againDBName : witDB.dbName
        witDB.dbVersion = againVersion ? againVersion : witDB.dbVersion
        witDB.request = witDB.indexedDB.open(witDB.dbName, witDB.dbVersion)
        witDB.request.onsuccess = function (event) {
            console.log(event)
            witDB.db = event.target.result // 数据库对象
            resolve(true)
        }
        witDB.request.onerror = function (event) {
            reject(false)
        }
    })

}

witDB.setDB = async (data, keyName, thisStoreName) => { //新增/更改数据
    if (keyName === undefined || keyName === null) {
        return throw new Error(`keyName不能为${keyName}`)
    }
    witDB.storeName = thisStoreName ? thisStoreName : witDB.storeName
    let isOpen
    if (!witDB.db) {
        isOpen = await againDB()
        if (!isOpen) {
            console.log(`浏览器数据库打开失败,请检查浏览器数据库是否创建！`)
            return
        }
    }

    let req = witDB.db.transaction([witDB.storeName], 'readwrite').objectStore(witDB.storeName).put(data, keyName);
    return new Promise((resolve, reject) => {
        req.onsuccess = (res) => {
            console.log(`${keyName}新增/更新成功!`)
            witDB.db.close()
            resolve(res.target.result)
        }
        req.onerror = (err) => {
            witDB.db.close()
            console.log(`${keyName}新增/更新失败!`)
            reject(err.target.result)
        }
    })
}

witDB.getDB = async (keyName, thisStoreName) => { //查找数据
    if (keyName === undefined || keyName === null) {
        return throw new Error(`keyName不能为${keyName}`)
    }
    witDB.storeName = thisStoreName ? thisStoreName : witDB.storeName
    let isOpen
    if (!witDB.db) {
        isOpen = await witDB.againDB()
        if (!isOpen) {
            console.log(`浏览器数据库打开失败,请检查浏览器数据库是否创建！`)
            return
        }
    }
    let req = witDB.db.transaction([witDB.storeName], 'readwrite').objectStore(witDB.storeName).get(keyName);
    return new Promise((resolve, reject) => {
        req.onsuccess = (res) => {
            witDB.db.close()
            console.log(`${keyName}获取成功!`)
            resolve(res.target.result)
        }
        req.onerror = (err) => {
            witDB.db.close()
            console.log(`${keyName}获取失败!`)
            reject(err.target.result)
        }
    })
}

witDB.delDB = async (keyName, thisStoreName) => { //删除数据
    if (keyName === undefined || keyName === null) {
        return throw new Error(`keyName不能为${keyName}`)
    }
    witDB.storeName = thisStoreName ? thisStoreName : witDB.storeName
    let isOpen
    if (!witDB.db) {
        isOpen = await witDB.againDB()
        if (!isOpen) {
            console.log(`浏览器数据库打开失败,请检查浏览器数据库是否创建！`)
            return
        }
    }
    let req = witDB.db.transaction([witDB.storeName], 'readwrite').objectStore(witDB.storeName).delete(keyName);
    return new Promise((resolve, reject) => {
        req.onsuccess = (res) => {
            witDB.db.close()
            console.log(`${keyName}删除成功!`)
            resolve(res.target.readyState)
        }
        req.onerror = (err) => {
            witDB.db.close()
            console.log(`${keyName}删除失败!`)
            reject(err.target.result)
        }
    })
}

export default witDB