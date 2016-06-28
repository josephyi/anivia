import React from 'react'
import {Grid, Row, Col, ListGroup, ListGroupItem} from 'react-bootstrap'
import champ_icons from '../css/StaticChampionSprites.css'
import {canonicalize, leagueInfo, leagueWinLoss} from '../util/DataFormatter'
import {Link} from 'react-router'

const blueTeam = {borderWidth: '2px 0 2px 0', borderStyle: 'solid', borderColor: '#5bc0de'}
const redTeam = {borderWidth: '2px 0 2px 0', borderStyle: 'solid', borderColor: '#d9534f'}


const DefaultGame = ({region, game, rankedLeagues, summoners}) => (
    <Row>
        <Col md={6}>
            <div style={blueTeam} className="clearfix">
                <ListGroup>
                    {renderParticipants(region, game.participants.filter(p => p.teamId == 100), rankedLeagues, summoners)}
                </ListGroup>
            </div>
        </Col>
        <Col md={6}>
            <div style={redTeam} className="clearfix">
                <ListGroup>
                    {renderParticipants(region, game.participants.filter(p => p.teamId == 200), rankedLeagues, summoners)}
                </ListGroup>
            </div>
        </Col>
    </Row>
)

const renderParticipants = (region, participants, rankedLeagues, summoners) => (
    participants.map(participant => renderParticipant(region, participant, rankedLeagues, summoners))
)

const renderParticipant = (region, participant, rankedLeagues, summoners) => (
    <ListGroupItem key={participant.summonerName}>
        <Row>
            <Col md={2} mdPush={participant.teamId == 100 ? 0 : 10}><i
                className={`${champ_icons["champion-" + participant.championId]}  ${participant.teamId == 100 ? '' : 'pull-right'}`}></i></Col>
            <Col md={6} mdPush={participant.teamId == 100 ? 0 : 2}>
                <div className={participant.teamId == 100 ? 'text-right' : 'text-left'}><Link
                    to={`${region}/${canonicalize(participant.summonerName)}`}>{participant.summonerName}</Link>
                    <p>{ summoners[canonicalize(participant.summonerName)] ? leagueInfo(rankedLeagues, summoners[canonicalize(participant.summonerName)]["id"]) : ''}</p>
                </div>
            </Col>
            <Col md={4} mdPull={participant.teamId == 100 ? 0 : 8}>
                <div className={participant.teamId == 100 ? 'text-right' : 'text-left'}>
                    { summoners[canonicalize(participant.summonerName)] ? leagueWinLoss(rankedLeagues, summoners[canonicalize(participant.summonerName)]["id"]) : ''}
                </div>
            </Col>
        </Row>
    </ListGroupItem>
)


export default DefaultGame