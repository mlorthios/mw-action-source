import SyncStorage from 'sync-storage';
import { initialMode } from 'react-native-dark-mode';

export default class StorageService {

    set(key, data) {
        SyncStorage.set(key, data);
    }

    get(key) {

        const data = SyncStorage.get(key);
        if(data != undefined) {
            return data;
        } else {
            return data;
        }
    }
      

}