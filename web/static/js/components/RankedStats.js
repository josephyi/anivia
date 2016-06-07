import React from 'react'
import { Table } from 'react-bootstrap'
import champ_icons from '../css/StaticChampionSprites.css'
import champions from '../data/champ_id_to_name.json'

const RankedStats = props => {
    return(
        <Table striped hover>
            <thead>
            <tr>
                <th>Champion</th>
                <th>Win</th>
                <th>Loss</th>
                <th>Win %</th>
                <th className="text-center">KDA</th>
                <th>Avg CS</th>
            </tr>
            </thead>
            <tbody>
            { renderRankedStatsRows(props.rankedStats) }
            </tbody>
        </Table>
    )
}

const renderRankedStatsRows = rows => (
    rows.map(champion => renderRankedStatsRow(champion))
)

const renderRankedStatsRow = champion => (
    <tr key={champion.id}>
        <td><i className={champ_icons["champion-" + champion.id]}></i>{' '}{champions[champion.id]}
        </td>
        <td>{champion.totalSessionsWon}</td>
        <td>{champion.totalSessionsLost}</td>
        <td>{`${Math.round(champion.totalSessionsWon / champion.totalSessionsPlayed * 100)}%`}</td>
        <td className="text-center">{`${(champion.totalChampionKills/champion.totalSessionsPlayed).toFixed(2)}/${(champion.totalDeathsPerSession/champion.totalSessionsPlayed).toFixed(2)}/${(champion.totalAssists/champion.totalSessionsPlayed).toFixed(2)}`}
            <br />{champion.totalDeathsPerSession > 0 ? ((champion.totalChampionKills + champion.totalAssists) / champion.totalDeathsPerSession).toFixed(2) : "Perfect"}</td>
        <td>{Math.round(champion.totalMinionKills / champion.totalSessionsPlayed)}</td>
    </tr>
)

export default RankedStats