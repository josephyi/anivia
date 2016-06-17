import React from 'react'
import { Table } from 'react-bootstrap'
import champ_icons from '../css/StaticChampionSprites.css'
import championIcon from '../css/ChampionIcon.css'
import champions from '../data/champ_id_to_name.json'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

const RankedStats = ({rankedStats}) => {
    return(
        <BootstrapTable data={rankedStats} striped={true} condensed={true} bordered={false}>
            <TableHeaderColumn dataFormat={championIconFormatter} dataField="id" isKey={true} dataSort={true} sortFunc={championNameSorter}>Champion</TableHeaderColumn>
            <TableHeaderColumn dataField="totalSessionsPlayed" dataSort={true}>Games</TableHeaderColumn>
            <TableHeaderColumn dataAlign="center" dataField="totalSessionsWon" dataFormat={winLossFormatter}>W-L</TableHeaderColumn>
            <TableHeaderColumn dataAlign="center" dataField="totalSessionsWon" dataFormat={kdaFormatter}>KDA</TableHeaderColumn>
        </BootstrapTable>
    )

    // return(
    //     <Table striped hover>
    //         <thead>
    //         <tr>
    //             <th>Champion</th>
    //             <th>Win</th>
    //             <th>Loss</th>
    //             <th>Win %</th>
    //             <th className="text-center">KDA</th>
    //             <th>Avg CS</th>
    //         </tr>
    //         </thead>
    //         <tbody>
    //         { renderRankedStatsRows(props.rankedStats) }
    //         </tbody>
    //     </Table>
    // )
}

function championNameSorter(a, b, order) {
    let retVal = 0

    if(champions[a.id] > champions[b.id]) retVal = -1
    if(champions[a.id] < champions[b.id]) retVal = 1
    if(order === 'desc') retVal *= -1

    return retVal
}

const kdaFormatter = (cell, row) => (
    `${row.totalDeathsPerSession > 0 ? ((row.totalChampionKills + row.totalAssists) / row.totalDeathsPerSession).toFixed(2) : "Perfect"}`
)

const winLossFormatter = (cell, row) => (
    <div>
        <div>{row.totalSessionsWon}W-{row.totalSessionsLost}L</div>
        <div>{Math.round(row.totalSessionsWon / row.totalSessionsPlayed * 100)}%</div>
    </div>
)

const championIconFormatter = (cell, row) => (

    <div className="clearfix rankedStatsCellName">
        <i className={`${champ_icons["champion-" + cell]}`}></i>
    </div>

)

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