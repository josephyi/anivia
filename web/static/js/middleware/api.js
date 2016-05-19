import 'isomorphic-fetch'

function callApi(endpoint) {

    return fetch(endpoint)
        .then(response =>
            response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
            if (!response.ok) {
                return Promise.reject(json)
            }

            const camelizedJson = camelizeKeys(json)
            const nextPageUrl = getNextPageUrl(response)

            return Object.assign({},
                normalize(camelizedJson, schema),
                { nextPageUrl }
            )
        })
}

export const CALL_API = Symbol('Call API')

export default store => next => action => {
    const callAPI = action[CALL_API]
    if (typeof callAPI === 'undefined') {
        return next(action)
    }

    let { endpoint } = callAPI
    const { types } = callAPI

    function actionWith(data) {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_API]
        return finalAction
    }



    const [ requestType, successType, failureType ] = types
    next(actionWith({ type: requestType }))

    return callApi(endpoint).then(
            response => next(actionWith({
            response,
            type: successType
        })),
            error => next(actionWith({
            type: failureType,
            error: error.message || 'Something bad happened'
        }))
    )
    // check to see if this middleware should handle the action

    // const { endpoint, types } = action
    // const [ requestType, successType, failureType ] = types
}