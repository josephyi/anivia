import { combineReducers } from 'redux'
import {reducer as formReducer} from 'redux-form'
import { routerReducer as routing } from 'react-router-redux'
import merge from 'lodash/merge'

function entities(state = {}, action) {
    if(action.response) {
        console.log("lets merge")
        console.log(action.response)
        console.log(merge({}, state, action.response))

        return merge({}, state, action.response)
    } else {
        return state
    }
}

const reducers = {
    // ... your other reducers here ...
    entities,
    form: formReducer,
    routing
};

const rootReducer = combineReducers(reducers);

export default rootReducer