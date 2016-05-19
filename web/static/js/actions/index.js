import { CALL_API } from '../middleware/api'

export const SUMMONER_SEARCH_FAILURE = 'SUMMONER_SEARCH_FAILURE'
export const SUMMONER_SEARCH_SUCCESS = 'SUMMONER_SEARCH_SUCCESS'
export const SUMMONER_SEARCH_REQUEST = 'SUMMONER_SEARCH_REQUEST'

function doSummonerSearch(region, summonerName) {
    return {
        [CALL_API] : {
            types: [SUMMONER_SEARCH_REQUEST, SUMMONER_SEARCH_SUCCESS, SUMMONER_SEARCH_FAILURE],
            endpoint: `${region}/${summonerName}`
        }
    }
}

export function loadSummoner(region, summonerName) {
    return (dispatch, getState) => {
        console.log('before dispatch')
        return dispatch(doSummonerSearch(region, summonerName))
    }
}