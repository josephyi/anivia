import React from 'react'
import { Label } from 'react-bootstrap'
export function canonicalize(name) {
    return name.replace(/\s/g, "").toLowerCase()
}

export function gameType(id) {
    switch (id) {
        case 2:
            return 'Normal 5v5 Blind Pick'
        case 4:
            return 'Ranked Solo 5v5'
        case 65:
            return 'ARAM'
        case 410:
            return 'Ranked 5v5 Draft Pick'
        default:
            return id
    }
}



export function rankedWinLoss(queueType, rankedLeagues, summonerId) {
    if (rankedLeagues[summonerId]) {
        return `${rankedLeagues[summonerId][0]['entries'][0]['wins']}W - ${rankedLeagues[summonerId][0]['entries'][0]['losses']}L`
    }
}

export const leagueInfo = (rankedLeagues, summonerId) => {
    const league = rankedLeagues[summonerId]
    if(league) {
        return (<span>
            {tierAndDivision(league[0])}{' '}
            ({league[0]['entries'][0]['leaguePoints']} LP)</span>)
    } else {
        <span>Not Placed</span>
    }
}

export const tierAndDivision = league => {
    if(league['tier'] == 'CHALLENGER' ||  league['tier'] == 'MASTER') {
        return (<span>{league['tier']}</span>)
        
    } else {
        return (<span>{league['tier']} {league['entries'][0]['division']}</span>)
    }
}

export const leagueWinLoss = (rankedLeagues, summonerId) => {
    const league = rankedLeagues[summonerId]

    if(league) {
        const wins = league[0]['entries'][0]['wins']
        const losses = league[0]['entries'][0]['losses']
       return (
           <span>{wins}W-{losses}L<p>{winPercentageBadge(wins, wins + losses)}</p></span>
       )
    } else return null
}

export function winPercentageBadge (wins, games) {
    const percentage = Math.round(wins / games * 100)
    let labelStyle = 'default'
    if(percentage >= 70)
        labelStyle = 'warning'
    else if(percentage >= 60)
        labelStyle = 'info'
    else if(percentage >= 50)
        labelStyle = 'primary'

    return(<Label bsStyle={labelStyle}>{percentage}%</Label>)
}