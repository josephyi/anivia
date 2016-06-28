import React from 'react'
import { Table } from 'react-bootstrap'
import champ_icons from '../css/StaticChampionSprites.css'
import championIcon from '../css/ChampionIcon.css'
import champions from '../data/champ_id_to_name.json'
import { Panel, Label } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { winPercentageBadge } from '../util/DataFormatter'

const RankedStats = ({ rankedStats, summoner }) => {
    if(rankedStats && summoner.summonerLevel == 30) {
        return (
            <Panel header={<h3>Ranked Stats</h3>} collapsible defaultExpanded bsStyle="info">
                <BootstrapTable fill data={rankedStats} striped={true} condensed={true} bordered={false}>
                    <TableHeaderColumn dataFormat={championIconFormatter} dataField="id" isKey={true} dataSort={true}
                                       sortFunc={championNameSorter}>Champion</TableHeaderColumn>
                    <TableHeaderColumn dataField="totalSessionsPlayed" dataSort={true}>Games</TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" dataField="totalSessionsWon"
                                       dataFormat={winLossFormatter}>W-L</TableHeaderColumn>
                    <TableHeaderColumn dataAlign="center" dataField="totalSessionsWon"
                                       dataFormat={kdaFormatter}>KDA</TableHeaderColumn>
                </BootstrapTable>
            </Panel>
        )
    } else {
        return null
    }
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
        <div>{row.totalSessionsWon}W-{row.totalSessionsLost}L, {winPercentageBadge(row.totalSessionsWon, row.totalSessionsPlayed)}</div>
    </div>
)

const championIconFormatter = (cell, row) => (
    <div className="clearfix rankedStatsCellName">
        <i className={`${champ_icons["champion-" + cell]} ${championIcon.medium}`}></i>
    </div>

)



export default RankedStats