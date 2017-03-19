import {CALL_API} from '../middleware/api';

export const SUMMONER_FAILURE = 'SUMMONER_FAILURE';
export const SUMMONER_SUCCESS = 'SUMMONER_SUCCESS';
export const SUMMONER_REQUEST = 'SUMMONER_REQUEST';

function doSummonerQuery(region, summonerName) {
  return {
    [CALL_API]: {
      types: [SUMMONER_REQUEST, SUMMONER_SUCCESS, SUMMONER_FAILURE],
      endpoint: `${region}/${summonerName}`,
    },
  };
}

function doRankedDataQuery(region, summonerId) {
  return {
    [CALL_API]: {
      types: [
        'RANKED_DATA_REQUEST',
        'RANKED_DATA_SUCCESS',
        'RANKED_DATA_FAILURE',
      ],
      endpoint: `${region}/${summonerId}/games_and_ranked_stats`,
    },
  };
}

function doFeaturedGames(region) {
  return {
    [CALL_API]: {
      types: [
        'FEATURED_GAMES_REQUEST',
        'FEATURED_GAMES_SUCCESS',
        'FEATURED_GAMES_FAILURE',
      ],
      endpoint: `featured_games/${region}`,
    },
  };
}

export function loadSummoner(region, summonerName) {
  return (dispatch, getState) => {
    const stateRegion = getState().entities[region];
    if (
      stateRegion &&
      stateRegion['summoners'] &&
      stateRegion['summoners'][summonerName]
    ) {
      const summoner_id = stateRegion['summoners'][summonerName]['id'];
      if (stateRegion['rankedStatsData'][summoner_id] === undefined) {
        return dispatch(doRankedDataQuery(region, summoner_id));
      }
      return null;
    }
    return dispatch(doSummonerQuery(region, summonerName));
  };
}

export function loadFeaturedGames(region) {
  return (dispatch, getState) => {
    const stateRegion = getState().entities[region];
    return dispatch(doFeaturedGames(region));
  };
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE,
  };
}
