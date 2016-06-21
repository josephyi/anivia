import React from 'react'
import { Carousel, Panel, Table, Row, Col } from 'react-bootstrap'

const FeaturedGames = ({featuredGames}) => {
    if(featuredGames) {
        return (
            <Carousel>
                {renderFeaturedGames(featuredGames)}
            </Carousel>
        )
    } else return null
}

const renderFeaturedGames = games => (
    games.map(game => renderGame(game))
)

const renderGame = game => (
    <Carousel.Item>
        <Row><Col mdOffset={2} md={8}>
        <Panel header={<h3>Current Game</h3>} bsStyle="info">
            <Table fill>
                <tbody>
        {renderParticipants(game.participants)}
                </tbody></Table>
        </Panel>
        </Col></Row>
    </Carousel.Item>
)

const renderParticipants = participants => (
    participants.map(participant => renderParticipant(participant))
)

const renderParticipant = participant => (
    <tr>
        <td>{participant.summonerName}</td>
    </tr>
)

export default FeaturedGames