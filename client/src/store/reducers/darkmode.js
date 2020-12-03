import { initialMode } from 'react-native-dark-mode';
import StorageService from '../../services/storage.service';

const initialState = { themeMode: initialMode }

function changeThemeMode(state = initialState, action) {
  let nextState
  switch (action.type) {
    case 'CHANGE_THEMEMODE':
        nextState = {
            themeMode: action.value
        }
        return nextState || state
  default:
    return state
  }
}

export default changeThemeMode;