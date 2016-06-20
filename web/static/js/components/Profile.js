import React from 'react'
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap'

const Profile = ({summoner, aggregateRankedStats, rankedLeagues}) => {
    if (aggregateRankedStats && summoner.summonerLevel == 30 && rankedLeagues) {
        return (
            <Panel header={<h3>{summoner.name || "loading..."}</h3>} bsStyle="primary">
                <div className="text-center ">
                <img src={`http://ddragon.leagueoflegends.com/cdn/6.12.1/img/profileicon/${summoner.profileIconId || '666'}.png`}/>
                </div>


                <ListGroup fill>
                    <ListGroupItem header="Ranked">{rankedLeagues[summoner.id][0]['tier']}{' '}
                        {rankedLeagues[summoner.id][0]['entries'][0]['division']}{' '}
                        ({rankedLeagues[summoner.id][0]['entries'][0]['leaguePoints']} LP)<br />{aggregateRankedStats.totalSessionsWon || '0'}W-{aggregateRankedStats.totalSessionsLost || '0'}L<br/>
                        KDA: {(aggregateRankedStats.totalChampionKills / aggregateRankedStats.totalSessionsPlayed).toFixed(2)}
                        /{(aggregateRankedStats.totalDeathsPerSession / aggregateRankedStats.totalSessionsPlayed).toFixed(2)}
                        /{(aggregateRankedStats.totalAssists / aggregateRankedStats.totalSessionsPlayed).toFixed(2)},
                        {' '}{((aggregateRankedStats.totalChampionKills + aggregateRankedStats.totalAssists) / aggregateRankedStats.totalDeathsPerSession).toFixed(2)}:1</ListGroupItem>
                </ListGroup>
            </Panel>)
    } else {
        return(
            <Panel header={<h3>{summoner.name || "loading..."}</h3>} bsStyle="primary">
                <div className="text-center ">
                    <img src={`http://ddragon.leagueoflegends.com/cdn/6.12.1/img/profileicon/${summoner.profileIconId || '666'}.png`}/>
                </div>
                <ListGroup fill>
                    <ListGroupItem>Level {summoner.summonerLevel}</ListGroupItem>
                </ListGroup>
            </Panel>
        )
    }
}

export default Profile