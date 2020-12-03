import { createStore } from 'redux';
import changeThemeMode from './reducers/darkmode';

export default createStore(changeThemeMode);

