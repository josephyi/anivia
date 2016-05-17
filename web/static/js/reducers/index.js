import { combineReducers } from 'redux'
import {reducer as formReducer} from 'redux-form'
import { routerReducer as routing } from 'react-router-redux'

const reducers = {
    // ... your other reducers here ...
    form: formReducer,
    routing
};

const rootReducer = combineReducers(reducers);

export default rootReducer