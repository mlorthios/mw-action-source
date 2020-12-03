// Imports: Dependencies
import { combineReducers } from 'redux';
// Imports: Reducers
import authReducer from './reducers/authReducer';
import chatReducer from './reducers/chatReducer';

// Redux: Root Reducer
const rootReducer = combineReducers({
  authReducer: authReducer,
  chatReducer: chatReducer,
});
// Exports
export default rootReducer;