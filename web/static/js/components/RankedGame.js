import React from 'react'
import { Grid, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap'
import champ_icons from '../css/StaticChampionSprites.css'
import championIcon from '../css/ChampionIcon.css'
import { canonicalize, gameType, leagueInfo } from '../util/DataFormatter'
import { Link } from 'react-router'

const RankedGame = ({region, game, rankedLeagues, summoners}) => (
      <Row>
          <Col md={1}>
              <h4 className="text-center">Bans</h4>
              <ListGroup>
                  {renderBans(game.bannedChampions.filter(b => b.teamId == 100))}
              </ListGroup>
          </Col>
          <Col md={5}>
              <ListGroup>
              {renderParticipants(region, game.participants.filter(p => p.teamId == 100), rankedLeagues, summoners)}
              </ListGroup>
          </Col>
          <Col md={5}>
              <ListGroup>{renderParticipants(region, game.participants.filter(p => p.teamId == 200), rankedLeagues, summoners)}
              </ListGroup>
          </Col>
          <Col md={1} >
              <h4 className="text-center">Bans</h4>
              <ListGroup>
                  {renderBans(game.bannedChampions.filter(b => b.teamId == 200))}
              </ListGroup>
          </Col>

      </Row>
    
)

const renderBans = (bans) => (
  bans.map(ban => renderBan(ban.championId))
)

const renderBan = (championId) => (
    <ListGroupItem key={championId}>
        <i className={`${champ_icons["champion-" + championId]} ${championIcon.medium}`}></i>
    </ListGroupItem>
)

const renderParticipants = (region, participants, rankedLeagues, summoners) => (
    participants.map(participant => renderParticipant(region, participant, rankedLeagues, summoners))
)

const renderParticipant = (region, participant, rankedLeagues, summoners) => (
    <ListGroupItem key={participant.summonerName}>
        <Row>
        <Col md={2} mdPush={participant.teamId == 100 ? 0 : 10}><i className={`${champ_icons["champion-" + participant.championId]} ${championIcon.medium} ${participant.teamId == 100 ? '' : 'pull-right'}`}></i></Col>
        <Col md={5} mdPush={participant.teamId == 100 ? 0 : 4}><Link to={`${region}/${canonicalize(participant.summonerName)}`}>{participant.summonerName}</Link></Col>
        <Col md={5} mdPull={participant.teamId == 100 ? 0 : 7}>{leagueInfo(rankedLeagues, summoners[canonicalize(participant.summonerName)]["id"])}</Col>
       </Row>
    </ListGroupItem>
)

export default RankedGame