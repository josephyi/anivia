import React from 'react'
import { Link } from 'react-router'
import { Carousel, Panel, Table, Row, Col } from 'react-bootstrap'
import { canonicalize, gameType } from '../util/DataFormatter'
import champ_icons from '../css/StaticChampionSprites.css'
import championIcon from '../css/ChampionIcon.css'

const FeaturedGames = ({featuredGames, region}) => {
    if(featuredGames) {
        return (
            <Carousel>
                {renderFeaturedGames(region, featuredGames)}
            </Carousel>
        )
    } else return null
}

const renderFeaturedGames = (region, games) => (
    games.map(game => renderGame(region, game))
)

const renderGame = (region, game) => (
    <Carousel.Item>
        <Row><Col mdOffset={2} md={8}>
        <Panel header={gameType(game.gameQueueConfigId)} bsStyle="info">
            <Table fill>
                <tbody>
        {renderParticipants(region, game.participants)}
                </tbody></Table>
        </Panel>
        </Col></Row>
    </Carousel.Item>
)

const renderParticipants = (region, participants) => (
    participants.map(participant => renderParticipant(region, participant))
)

const renderParticipant = (region, participant) => (
    <tr>
        <td><i className={`${champ_icons["champion-" + participant.championId]} ${championIcon.medium}`}></i></td>
        <td><a href={`${region}/${canonicalize(participant.summonerName)}`}>{participant.summonerName}</a></td>
    </tr>
)

export default FeaturedGames