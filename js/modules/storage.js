/**
    Este archivo JavaScript define dos clases: Storage para guardar valores en el almacenamiento local
    y StorageController para gestionar múltiples instancias de almacenamiento y recuperar valores del almacenamiento local.
*/


/**
 * A class for handling saving values to local storage.
 */
export class Storage {

    constructor(values) {
        this.values = values;
    }

    saveToLocalStorage() {
        const saveLocal = (key, value) => {
            localStorage.setItem(key, value);
        };

        // Iterate through the stored values and save them to local storage as JSON strings.
        for (const key in this.values) {
            saveLocal(key, JSON.stringify(this.values[key]));
        }
    }
}

/**
 * A class for managing multiple storage instances.
 */
export class StorageController {
    constructor() {
        this.storages = [];
    }

    addStorage(storage) {
        this.storages.push(storage);
    }

    saveAllStorages() {
        // Iterate through all managed storages and save them to local storage.
        for (const storage of this.storages) {
            storage.saveToLocalStorage();
        }
    }

    getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}
