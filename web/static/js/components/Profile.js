import React from 'react'
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import ProfileRankedStats from './ProfileRankedStats'

const Profile = ({summoner, aggregateRankedStats, rankedLeagues}) => {
    if (aggregateRankedStats && summoner.summonerLevel == 30 && rankedLeagues[summoner.id]) {
        return (
            <Panel header={<h3>{summoner.name || "loading..."}</h3>} bsStyle="primary">
                <div>
                <div className="text-center ">
                <img src={`http://ddragon.leagueoflegends.com/cdn/6.12.1/img/profileicon/${summoner.profileIconId || '666'}.png`}/>
                </div>
                <ProfileRankedStats summoner={summoner} rankedLeagues={rankedLeagues} aggregateRankedStats={aggregateRankedStats} />
                </div>
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