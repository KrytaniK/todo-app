import Database from "../utils/indexedDB";

const useIndexedDB = (dbName = 'todo') => {

    const db = new Database(dbName);

    const get = (storeName, itemID) => {
        return db.store(storeName).get(itemID);
    }

    const getAll = (storeName) => {
        return db.store(storeName).getAll();
    }

    const add = (storeName, item) => {
        return db.store(storeName).add(item);
    }

    const update = (storeName, item) => {
        return db.store(storeName).update(item);
    }

    const remove = (storeName, id) => {
        return db.store(storeName).remove(id);
    }

    return {
        get,
        getAll,
        add,
        update,
        remove
    }
}

export default useIndexedDB;