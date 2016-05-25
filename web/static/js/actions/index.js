import { CALL_API } from '../middleware/api'

export const SUMMONER_DETAIL_FAILURE = 'SUMMONER_DETAIL_FAILURE'
export const SUMMONER_DETAIL_SUCCESS = 'SUMMONER_DETAIL_SUCCESS'
export const SUMMONER_DETAIL_REQUEST = 'SUMMONER_DETAIL_REQUEST'

function doSummonerSearch(region, summonerId) {
    return {
        [CALL_API] : {
            types: [SUMMONER_DETAIL_REQUEST, SUMMONER_DETAIL_SUCCESS, SUMMONER_DETAIL_FAILURE],
            endpoint: `${region}/${summonerId}/detail`
        }
    }
}

export function loadSummonerDetail(region, summonerId) {
    return (dispatch, getState) => {
        return dispatch(doSummonerSearch(region, summonerId))
    }
}

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
        return dispatch(doSummonerQuery(region, summonerName))
    }
}