import { CALL_API } from '../middleware/api'

export const SUMMONER_FAILURE = 'SUMMONER_FAILURE'
export const SUMMONER_SUCCESS = 'SUMMONER_SUCCESS'
export const SUMMONER_REQUEST = 'SUMMONER_REQUEST'

function doSummonerQuery(region, summonerName) {
    return {
        [CALL_API] : {
            types: [SUMMONER_REQUEST, SUMMONER_SUCCESS, SUMMONER_FAILURE],
            endpoint: `${region}/${summonerName}`
        }
    }
}

export function loadSummoner(region, summonerName) {
    return (dispatch, getState) => {
        const stateRegion = getState().entities[region]
        if(stateRegion && stateRegion[summonerName])
            return null
        return dispatch(doSummonerQuery(region, summonerName))
    }
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export function resetErrorMessage() {
    return {
        type: RESET_ERROR_MESSAGE
    }
}