// Class for handling saving values to local storage
export class Storage {
    constructor(values) {
        this.values = values;
    }

    saveToLocalStorage() {
        const saveLocal = (key, value) => {
            localStorage.setItem(key, value)
        };

        for (const key in this.values) {
            saveLocal(key, JSON.stringify(this.values[key]));
        }
    }
}

// Class for managing multiple storage instances
export class StorageController {
    constructor() {
        this.storages = [];
    }

    addStorage(storage) {
        this.storages.push(storage);
    }

    saveAllStorages() {
        for (const storage of this.storages) {
            storage.saveToLocalStorage();
        }
    }

    getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}