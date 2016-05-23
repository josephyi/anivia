import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import api from '../middleware/api'

export default function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(thunk, api),
        window.devToolsExtension ? window.devToolsExtension() : f => f)
    )
}