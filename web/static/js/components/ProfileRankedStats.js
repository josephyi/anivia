import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

const ProfileRankedStats = ({summoner, rankedLeagues, aggregateRankedStats}) => (
    <ListGroup>
        {renderRankedLeagues(rankedLeagues[summoner.id])}
    </ListGroup>
)

const renderRankedLeagues = (rows) => (
    rows.map(row => renderRankedLeague(row))
)

// TODO iterate through rankedleagues rather than using first index
const renderRankedLeague = (row) => (
    <ListGroupItem>
        {row['queue']}{' '}<br/>
        {renderEntries(row['entries'], row['tier'])}
    </ListGroupItem>
)

const renderEntries = (rows, tier) => (
    rows.map(row => renderEntry(row, tier))
)

const renderEntry = (row, tier) => (
    <div>
        {tier}{' '}{row['division']}{` (${row['leaguePoints']} LP)`}<br />
        {row['playerOrTeamName']}<br />
    </div>
)

export default ProfileRankedStats

