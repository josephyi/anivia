import React from 'react'
import { Link } from 'react-router'

const CurrentGame = ({currentGame, region}) => {
    if(currentGame) {
        console.log(currentGame)
        console.log(region)
    return (
        <div>
            { renderParticipants(region, currentGame.participants)}
        </div>
    )} else return (<div>Not Playing</div>)
}

const renderParticipants = (region, rows) => (
    rows.map(row => renderParticipant(region, row))
)

const renderParticipant = (region, row) => (
    <div key={row.summonerId}>
        <Link to={`/${region}/${canonicalize(row.summonerName)}`}>{row.summonerName}</Link>
        <a href={`/${region}/${canonicalize(row.summonerName)}`}>{row.summonerName}</a>
    </div>
)

function canonicalize(name) {
    return name.replace(/\s/g, "").toLowerCase()
}

export default CurrentGame