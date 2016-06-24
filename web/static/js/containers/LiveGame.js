import React from 'react'
import RankedGame from '../components/RankedGame'
import DefaultGame from '../components/DefaultGame'
import GameNotFound from '../components/GameNotFound'

const LiveGame = ({region, game, rankedLeagues}) => {
    switch(game.gameQueueConfigId) {
      case 4:
      case 410:
        return (<RankedGame region={region} game={game} rankedLeagues={rankedLeagues} />) 
      default:
        return (<DefaultGame />)
    }
}

export default LiveGame