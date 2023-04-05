import Database from "../utils/indexedDB";

const useIndexedDB = (dbName = 'todo') => {

    const db = new Database(dbName);

    const add = (storeName, item) => {
        db.store(storeName).add(item);
    }

    const update = (storeName, item) => {
        db.store(storeName).update(item);
    }

    const remove = (storeName, id) => {
        db.store(storeName).remove(id);
    }

    return {
        add,
        update,
        remove
    }
}

export default useIndexedDB;