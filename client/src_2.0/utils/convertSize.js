import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

let modelIphone = ['iPhone12,1', 'iPhone12,3', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8', 'iPhone12,5'];

class convertSize {

    MarginTopResponsive() {
        if(Platform.OS === 'ios') {
            if(modelIphone.includes(DeviceInfo.getDeviceId())) {
                return 46;
            } else {
                return 30
            }
        } else {
            return 25
        }
    }

}

export default convertSize;
