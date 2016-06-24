import React from 'react'
import { gameType } from '../util/DataFormatter'

const LiveGameContainer = ({region, game, rankedLeagues}) => {
    if(game && game.gameQueueConfigId) {
        return(
            <Panel header={gameType(game.gameQueueConfigId)} bsStyle="info">
             <LiveGame region={region} game={game} rankedLeagues={rankedLeagues} />
            </Panel>
        )
    } else {
        return(<GameNotFound />)
    }
}

export default LiveGameContainer