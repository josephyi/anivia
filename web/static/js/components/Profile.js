import React from 'react'
import { Panel } from 'react-bootstrap'

const Profile = ({summoner, aggregateRankedStats}) => {
    if (aggregateRankedStats && summoner.summonerLevel == 30) {
        return (
            <Panel header={<h3>{summoner.name || "loading..."}</h3>} bsStyle="primary">
                <div className="text-center ">
                <img src={`http://ddragon.leagueoflegends.com/cdn/6.10.1/img/profileicon/${summoner.profileIconId || '666'}.png`}/>
                <div>
                    Ranked: {aggregateRankedStats.totalSessionsWon || '0'}W-{aggregateRankedStats.totalSessionsLost || '0'}L</div>
                <div>Ranked
                    KDA: {(aggregateRankedStats.totalChampionKills / aggregateRankedStats.totalSessionsPlayed).toFixed(2)}
                    /{(aggregateRankedStats.totalDeathsPerSession / aggregateRankedStats.totalSessionsPlayed).toFixed(2)}
                    /{(aggregateRankedStats.totalAssists / aggregateRankedStats.totalSessionsPlayed).toFixed(2)},
                    {' '}{((aggregateRankedStats.totalChampionKills + aggregateRankedStats.totalAssists) / aggregateRankedStats.totalDeathsPerSession).toFixed(2)}:1
                </div>
                </div>
            </Panel>)
    } else {
        return null
    }
}

export default Profile