export const SUMMONER_SEARCH_FAILURE = 'SUMMONER_SEARCH_FAILURE'
export const SUMMONER_SEARCH_SUCCESS = 'SUMMONER_SEARCH_SUCCESS'
export const SUMMONER_SEARCH_REQUEST = 'SUMMONER_SEARCH_REQUEST'

function doSummonerSearch(region, summonerName) {
    return {
        types: [SUMMONER_SEARCH_REQUEST, SUMMONER_SEARCH_SUCCESS, SUMMONER_SEARCH_FAILURE],
        endpoint: `${region}/${summonerName}`
    }
}

export function loadSummoner(region, summonerName) {
    // 
    // some caching logic here...
    //
    
    return dispatch(doSummonerSearch(region, summonerName))
}