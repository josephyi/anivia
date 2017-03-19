import React from 'react';
import {Link} from 'react-router';
import {Grid, Carousel, Panel, Table, Row, Col} from 'react-bootstrap';
import {canonicalize, gameType} from '../util/DataFormatter';
import champ_icons from '../css/StaticChampionSprites.css';
import championIcon from '../css/ChampionIcon.css';
import LiveGameContainer from '../containers/LiveGameContainer';

const FeaturedGames = ({featuredGames, region, rankedLeagues, summoners}) => {
  if (featuredGames) {
    return (
      <Row>
        {renderFeaturedGames(region, featuredGames, rankedLeagues, summoners)}
      </Row>
    );
  } else {
    return <img src="/images/loading.gif" />;
  }
};

const renderFeaturedGames = (region, games, rankedLeagues, summoners) =>
  games.map(game => renderGame(region, game, rankedLeagues, summoners));

const renderGame = (region, game, rankedLeagues, summoners) => (
  <Col md={12} key={game.gameId}>
    <LiveGameContainer
      region={region}
      game={game}
      rankedLeagues={rankedLeagues}
      summoners={summoners}
    />
  </Col>
);

const renderParticipants = (region, participants) =>
  participants.map(participant => renderParticipant(region, participant));

const renderParticipant = (region, participant) => (
  <tr key={participant.summonerName}>
    <td>
      <i
        className={
          `${champ_icons['champion-' + participant.championId]} ${championIcon.medium}`
        }
      />
    </td>
    <td>
      <Link to={`${region}/${canonicalize(participant.summonerName)}`}>
        {participant.summonerName}
      </Link>
    </td>
  </tr>
);

export default FeaturedGames;

// <Panel header={gameType(game.gameQueueConfigId)} bsStyle="info">
//     <Table fill>
// <tbody>
// {renderParticipants(region, game.participants)}
// </tbody></Table>
// </Panel>
