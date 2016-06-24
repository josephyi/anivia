import React from 'react'
import { Grid, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap'
import champ_icons from '../css/StaticChampionSprites.css'
import championIcon from '../css/ChampionIcon.css'
import { canonicalize, gameType } from '../util/DataFormatter'
import { Link } from 'react-router'

const RankedGame = ({region, game, rankedLeagues}) => (

      <Row>
          <Col md={1}>
              d
          </Col>
          <Col md={5}>
              <ListGroup>
              {renderParticipants(region, game.participants.filter(p => p.teamId == 100))}
              </ListGroup>
          </Col>
          <Col md={5}>
              <ListGroup>{renderParticipants(region, game.participants.filter(p => p.teamId == 200))}
              </ListGroup>
          </Col>
          <Col md={1}>
              d
          </Col>

      </Row>
    
)

const renderParticipants = (region, participants) => (
    participants.map(participant => renderParticipant(region, participant))
)

const renderParticipant = (region, participant) => (
    <ListGroupItem key={participant.summonerName}>
        <i className={`${champ_icons["champion-" + participant.championId]} ${championIcon.medium}`}></i>
        {' '}<Link to={`${region}/${canonicalize(participant.summonerName)}`}>{participant.summonerName}</Link>
    </ListGroupItem>
)

export default RankedGame