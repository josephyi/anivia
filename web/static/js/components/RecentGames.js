import React from 'react'
import { Table } from 'react-bootstrap'
import champ_icons from '../css/StaticChampionSprites.css'
import champions from '../data/champ_id_to_name.json'

const RecentGames = props => {
    return(
        <Table>
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
    <tr className={row['stats']['win'] === true ? 'success' : 'danger'}>
        <td><i className={champ_icons["champion-" + row.championId]}></i>{' '}{champions[row.championId]}</td>
        <td>{row['gameMode']} {row['gameType']} {row['subType']}</td>
        <td>{row['stats']['championsKilled'] || '0'}/{row['stats']['numDeaths'] || '0'}/{row['stats']['assists'] || '0'}</td>
    </tr>
)

export default RecentGames