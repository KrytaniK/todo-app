// FrontEnd Interface for IndexedDB
export default class Database {
    constructor(name) {
        this.dbDriver = new IDBDriver();
        this.dbName = name;
        this.debugMode = true;

        this.currentObjectStoreName = null;
    }

    store = (storeName) => {
        // Retrieve database info via local Storage
        const dbData = this.dbDriver.getLocalData(this.dbName);

        // If the provided name exists as an object store, return it.
        if (dbData.objectStoreNames.includes(storeName)) {
            this.currentObjectStoreName = storeName;
            return this;
        }

        // Otherwise, the database needs to be updated to reflect the addition of this object store.
        this.dbDriver.updateLocalData(this.dbName, {
            ...dbData,
            version: dbData.version + 1,
            objectStoreNames: [...dbData.objectStoreNames, storeName]
        });

        this.currentObjectStoreName = storeName;

        return this;
    }

    get = (itemID) => {

        return new Promise((resolve, reject) => {
            if (!this.currentObjectStoreName) {
                reject("No Object Store Specified! Please ensure you use db.store().add() if you wish to add an entry");
            }

            this.dbDriver.getConnection(this.dbName).then(connection => {
                const transaction = connection.transaction([this.currentObjectStoreName], 'readonly');
                transaction.oncomplete = () => connection.close();
                transaction.onerror = (event) => {
                    connection.close();
                    reject(event.target.error);
                }

                const store = transaction.objectStore(transaction.objectStoreNames[0]);
                const getRequest = store.get(itemID);
                getRequest.onsuccess = event => resolve(event.target.result);
                getRequest.onerror = event => reject(event.target.error);
            })
        })
    }

    getMany = (itemIDList = []) => {
        return new Promise((resolve, reject) => {
            if (!this.currentObjectStoreName) {
                reject("No Object Store Specified! Please ensure you use db.store().add() if you wish to add an entry");
            }

            this.dbDriver.getConnection(this.dbName).then(connection => {

                let result = [], errors = [];

                const transaction = connection.transaction([this.currentObjectStoreName], 'readonly');
                transaction.oncomplete = () => {
                    connection.close();
                    resolve({ result, errors });
                }

                for (let itemID of itemIDList) {
                    const store = transaction.objectStore(transaction.objectStoreNames[0]);
                    const getRequest = store.get(itemID);
                    getRequest.onsuccess = event => result.push(event.target.result);
                    getRequest.onerror = event => errors.push(event.target.error);
                }
            })
        })
    }

    getAll = () => {
        return new Promise((resolve, reject) => {
            if (!this.currentObjectStoreName) {
                reject("No Object Store Specified! Please ensure you use db.store().add() if you wish to add an entry");
            }

            this.dbDriver.getConnection(this.dbName).then(connection => {
                const transaction = connection.transaction([this.currentObjectStoreName], 'readonly');
                transaction.oncomplete = () => connection.close();
                transaction.onerror = (event) => {
                    connection.close();
                    reject(event.target.error);
                }

                const store = transaction.objectStore(transaction.objectStoreNames[0]);
                const getAllRequest = store.getAll();
                getAllRequest.onsuccess = event => resolve(event.target.result);
            })
        });
    }
    
    add = (item) => {
        return new Promise((resolve, reject) => {
            if (!this.currentObjectStoreName) {
                reject("No Object Store Specified! Please ensure you use db.store().add() if you wish to add an entry");
            }
            
            this.dbDriver.getConnection(this.dbName).then(connection => {

                const transaction = connection.transaction([this.currentObjectStoreName], 'readwrite');
                transaction.oncomplete = () => connection.close();
                transaction.onerror = (event) => {
                    connection.close();
                    reject(event.target.error);
                }

                const store = transaction.objectStore(transaction.objectStoreNames[0]);

                const cursorRequest = store.openCursor(item.id);
                cursorRequest.onsuccess = (event) => {
                    const cursor = event.target.result;

                    if (!cursor) {
                        const addRequest = store.add(item);
                        addRequest.onsuccess = event => resolve(event.target.result);
                        return;
                    }

                    if (this.debugMode)
                        console.warn("Database.add() | item with id of", item.id, "already exists!");
                }
            });
        });
    }

    addMany = (items = []) => {
        return new Promise((resolve, reject) => {
            if (!this.currentObjectStoreName) {
                reject("No Object Store Specified! Please ensure you use db.store().add() if you wish to add an entry");
            }
            
            this.dbDriver.getConnection(this.dbName).then(async (connection) => {

                let result = [], errors = [];

                const transaction = connection.transaction([this.currentObjectStoreName], 'readwrite');
                transaction.oncomplete = () => {
                    connection.close();
                    resolve({ result, errors });
                };

                const store = transaction.objectStore(transaction.objectStoreNames[0]);

                for (let item of items) {
                    const cursorRequest = store.openCursor(item.id);
                    cursorRequest.onsuccess = (event) => {
                        const cursor = event.target.result;

                        if (!cursor) {
                            const addRequest = store.add(item);
                            addRequest.onsuccess = event => result.push(event.target.result);
                            addRequest.onerror = event => errors.push(event.target.error);
                            return;
                        }
                        
                        errors.push(`${item.id} already exists`);   
                    }
                }
            });
        });
    }

    update = (item) => {
        return new Promise((resolve, reject) => {
            if (!this.currentObjectStoreName) {
                reject("No Object Store Specified! Please ensure you use db.store().update() if you wish to update an entry");
            }

            this.dbDriver.getConnection(this.dbName).then(connection => {

                const transaction = connection.transaction([this.currentObjectStoreName], 'readwrite');
                transaction.oncomplete = (event) => connection.close();
                transaction.onerror = (event) => {
                    connection.close();
                    reject(event.target.error);
                }

                const store = transaction.objectStore(transaction.objectStoreNames[0]);
                const putRequest = store.put(item);
                putRequest.onsuccess = event => resolve(event.target.result);
            })
        });
    }

    updateMany = (items = []) => {
        return new Promise((resolve, reject) => {
            if (!this.currentObjectStoreName) {
                reject("No Object Store Specified! Please ensure you use db.store().add() if you wish to add an entry");
            }
            
            this.dbDriver.getConnection(this.dbName).then(async (connection) => {

                let result = [], errors = [];

                const transaction = connection.transaction([this.currentObjectStoreName], 'readwrite');
                transaction.oncomplete = () => {
                    connection.close();
                    resolve({ result, errors });
                };

                const store = transaction.objectStore(transaction.objectStoreNames[0]);

                for (let item of items) {
                    const putRequest = store.put(item);
                    putRequest.onsuccess = event => result.push(event.target.result);
                    putRequest.onerror = event => errors.push(event.target.error);
                }
            });
        });
    }

    remove = (itemID) => {
        return new Promise((resolve, reject) => {
            if (!this.currentObjectStoreName) {
                reject("No Object Store Specified! Please ensure you use db.store().delete() if you wish to delete an entry");
            }

            this.dbDriver.getConnection(this.dbName).then(connection => {
                const transaction = connection.transaction([this.currentObjectStoreName], 'readwrite');
                transaction.oncomplete = () => connection.close();
                transaction.onerror = (event) => {
                    connection.close();
                    reject(event.target.error);
                }

                const store = transaction.objectStore(transaction.objectStoreNames[0]);

                const cursorRequest = store.openCursor(itemID);
                cursorRequest.onsuccess = (event) => {
                    const cursor = event.target.result;

                    if (cursor) {
                        const deleteRequest = store.delete(itemID);
                        deleteRequest.onsuccess = event => resolve(event.target.result);
                        return;
                    }

                    if (this.debugMode)
                        console.warn("Database.delete() | itemID of", itemID, "Does not exist!");
                }

            })
        })
    }

    removeMany = (itemIDList = []) => {
        return new Promise((resolve, reject) => {
            if (!this.currentObjectStoreName) {
                reject("No Object Store Specified! Please ensure you use db.store().delete() if you wish to delete an entry");
            }

            this.dbDriver.getConnection(this.dbName).then(connection => {
                const transaction = connection.transaction([this.currentObjectStoreName], 'readwrite');
                transaction.oncomplete = () => {
                    connection.close();
                    resolve({ result, errors });
                }

                let result = [], errors = [];

                const store = transaction.objectStore(transaction.objectStoreNames[0]);

                for (let id of itemIDList) {
                    const cursorRequest = store.openCursor(id);
                    cursorRequest.onsuccess = (event) => {
                        const cursor = event.target.result;

                        if (cursor) {
                            const deleteRequest = store.delete(id);
                            deleteRequest.onsuccess = event => result.push(event.target.result);
                            return;
                        }

                        errors.push("Database.delete() | itemID of" + id + "Does not exist!");
                    }
                }
            })
        })
    }
}

class IDBDriver {
    constructor() {

        this.getLocalData = (dbName) => {

            const dbs = JSON.parse(localStorage.getItem('databases')) || {};

            if (dbs[dbName])
                return dbs[dbName];
            
            dbs[dbName] = {
                name: dbName,
                version: 1,
                objectStoreNames: []
            }

            return dbs[dbName];
        }

        this.updateLocalData = (dbName, newData) => {
            const dbs = JSON.parse(localStorage.getItem('databases')) || {};
            dbs[dbName] = newData;
            localStorage.setItem('databases', JSON.stringify(dbs));
        }

        this.getConnection = (dbName) => {
            return new Promise((resolve, reject) => {
                const db = JSON.parse(localStorage.getItem('databases'))[dbName];

                const connectRequest = indexedDB.open(db.name, db.version);

                connectRequest.onupgradeneeded = (event) => {
                    const upgradeDB = event.target.result;

                    for (let objectStoreName of db.objectStoreNames) {
                        if (!upgradeDB.objectStoreNames.contains(objectStoreName))
                            upgradeDB.createObjectStore(objectStoreName, { keyPath: 'id' });
                    }
                }

                connectRequest.onsuccess = (event) => resolve(event.target.result);
                connectRequest.onerror = (event) => reject(event.target.error);
            });
        }
    }
}