import React from 'react'
import { gameType } from '../util/DataFormatter'
import { Panel } from 'react-bootstrap'
import LiveGame from '../containers/LiveGame'
import GameNotFound from '../components/GameNotFound'

const LiveGameContainer = ({region, game, rankedLeagues, summoners}) => {
    if(game && game.gameQueueConfigId && summoners) {
        return(
            <Panel header={gameType(game.gameQueueConfigId)} bsStyle="default" collapsible defaultExpanded>
             <LiveGame fill region={region} game={game} rankedLeagues={rankedLeagues} summoners={summoners} />
            </Panel>
        )
    } else {
        return(<GameNotFound></GameNotFound>)
    }
}

export default LiveGameContainer