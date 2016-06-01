import * as ActionTypes from '../actions'
import { combineReducers } from 'redux'
import {reducer as formReducer} from 'redux-form'
import { routerReducer as routing } from 'react-router-redux'
import merge from 'lodash/merge'

function entities(state = {summoner: {name: ""}, rankedStats: [], aggregateRankedStats: {}}, action) {
    if(action.response) {
        return merge({}, state, action.response)
    } else {
        return state
    }
}

const reducers = {
    entities,
    form: formReducer,
    errorMessage,
    routing
};

function errorMessage(state = null, action) {
    const { type, error } = action

    if (type === ActionTypes.RESET_ERROR_MESSAGE) {
        return null
    } else if (error) {
        return action.error
    }

    return state
}


const rootReducer = combineReducers(reducers);

export default rootReducer