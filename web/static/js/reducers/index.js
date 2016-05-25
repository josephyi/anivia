import { combineReducers } from 'redux'
import {reducer as formReducer} from 'redux-form'
import { routerReducer as routing } from 'react-router-redux'
import merge from 'lodash/merge'

function entities(state = {summoner: {name: ""}, rankedStats: []}, action) {
    if(action.response) {
        return merge({}, Object.assign({}, state, {rankedStats: []}), action.response)
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