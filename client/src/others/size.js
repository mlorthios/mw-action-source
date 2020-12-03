import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const Size = () => {
    if(Platform.OS === 'ios') {
        let deviceId = DeviceInfo.getDeviceId();
        if(deviceId == 'iPhone10,6') {
            return '-13';
        } else {
            return '0'
        }
    } else {
        return '0'
    }
}

