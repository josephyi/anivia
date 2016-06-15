import React from 'react'
import { Table, Label } from 'react-bootstrap'
import champ_icons from '../css/StaticChampionSprites.css'
import champions from '../data/champ_id_to_name.json'
import TimeAgo from 'react-timeago'

const RecentGames = props => {
    return(
        <Table bordered striped>
            <tbody>
            { renderRecentGames(props.recentGames) }
            </tbody>
        </Table>
    )
}

const renderRecentGames = rows => (
    rows.map(row => renderRecentGame(row))
)

const renderRecentGame = row => (
    <tr key={row.gameId}>
        <td><i className={champ_icons["champion-" + row.championId]}></i>{' '}{champions[row.championId]}</td>
        <td>{gameLabel(row['subType'])}</td>
        <td>{playerRoleLabel(row['stats']['playerRole'])} {playerPositionLabel(row['stats']['playerPosition'])}</td>
        <td>{row['stats']['championsKilled'] || '0'}/{row['stats']['numDeaths'] || '0'}/{row['stats']['assists'] || '0'}</td>
        <td>{timeLabel(row['stats']['timePlayed'])} </td>
        <td><Label bsStyle={row['stats']['win'] === true ? 'success' : 'danger'}><TimeAgo date={row['createDate']} /></Label></td>
    </tr>
)

function timeLabel(timePlayed) {
    const seconds = timePlayed % 60
    const secondsLabel = seconds > 0 ? `${seconds}s` : ''
   return `${Math.round(timePlayed / 60)}m${secondsLabel}`
}

function gameLabel(subType) {
    switch (subType) {
        case 'RANKED_SOLO_5x5':
            return 'Ranked'
        case 'NORMAL':
            return 'Normal'
        case 'ARAM_UNRANKED_5x5':
            return 'ARAM'
        case 'BOT':
            return 'Bots'
        case 'ODIN_UNRANKED' :
            return 'Dominion'
        default:
            return subType
    }
}

function playerRoleLabel(playerRole) {
    switch(playerRole) {
        case 1:
            return 'Duo'
        case 2:
            return 'Support'
        case 3:
            return 'Carry'
        case 4:
            return 'Solo'
        default:
            return playerRole
    }
}

function playerPositionLabel(playerPosition) {
    switch(playerPosition) {
        case 1:
            return 'Top'
        case 2:
            return 'Mid'
        case 3:
            return 'Jungle'
        case 4:
            return 'Bot'
        default:
            return playerPosition
    }
}

export default RecentGames