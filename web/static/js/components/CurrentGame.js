import React from 'react'
import { Link } from 'react-router'
import { Panel, Table } from 'react-bootstrap'
import champ_icons from '../css/StaticChampionSprites.css'
import championIcon from '../css/ChampionIcon.css'

const CurrentGame = ({currentGame, region, rankedLeagues}) => {
    if(currentGame) {

    return (
        <Panel header={<h3>Current Game</h3>} collapsible defaultExpanded bsStyle="info">
            <Table fill>
                <tbody>
            { renderParticipants(region, currentGame.participants, rankedLeagues)}
                </tbody>
            </Table>
        </Panel>
    )} else return (
        <Panel header={<h3>Current Game</h3>} collapsible defaultExpanded bsStyle="info">
         Not Playing
    </Panel>)
}

const renderParticipants = (region, rows, rankedLeagues) => (
    rows.map(row => renderParticipant(region, row, rankedLeagues))
)

const renderParticipant = (region, row, rankedLeagues) => (
    <tr key={row.summonerId}>
        <td><i className={`${champ_icons["champion-" + row.championId]} ${championIcon.medium}`}></i></td>
        <td><Link to={`/${region}/${canonicalize(row.summonerName)}`}>{row.summonerName}</Link></td>
        <td>
            {rankedLeagues[row.summonerId][0]['tier']}{' '}
            {rankedLeagues[row.summonerId][0]['entries'][0]['division']}{' '}
            ({rankedLeagues[row.summonerId][0]['entries'][0]['leaguePoints']} LP)
        </td>
        <td>{rankedLeagues[row.summonerId][0]['entries'][0]['wins']}W-{rankedLeagues[row.summonerId][0]['entries'][0]['losses']}L</td>
    </tr>
)

function canonicalize(name) {
    return name.replace(/\s/g, "").toLowerCase()
}

export default CurrentGame