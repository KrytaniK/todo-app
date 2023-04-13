import Database from "../utils/indexedDB";

const useIndexedDB = (dbName = 'todo') => {

    const db = new Database(dbName);

    const get = (storeName, itemID) => {
        return db.store(storeName).get(itemID);
    }

    const getMany = (storeName, itemIDList) => {
        return db.store(storeName).getMany(itemIDList);
    }

    const getAll = (storeName) => {
        return db.store(storeName).getAll();
    }

    const add = (storeName, item) => {
        return db.store(storeName).add(item);
    }

    const addMany = (storeName, items) => {
        return db.store(storeName).addMany(items);
    }

    const update = (storeName, item) => {
        return db.store(storeName).update(item);
    }

    const updateMany = (storeName, items) => {
        return db.store(storeName).updateMany(items);
    }

    const remove = (storeName, id) => {
        return db.store(storeName).remove(id);
    }

    const removeMany = (storeName, itemIDList) => {
        return db.store(storeName).removeMany(itemIDList);
    }

    return {
        get,
        getMany,
        getAll,
        add,
        addMany,
        update,
        updateMany,
        remove,
        removeMany,
    }
}

export default useIndexedDB;