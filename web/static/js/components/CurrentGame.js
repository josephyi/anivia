import React from 'react';
import {Link} from 'react-router';
import {Panel, Table} from 'react-bootstrap';
import {gameType, rankedWinLoss} from '../util/DataFormatter';
import champ_icons from '../css/StaticChampionSprites.css';
import championIcon from '../css/ChampionIcon.css';

const CurrentGame = ({currentGame, region, rankedLeagues}) => {
  if (currentGame && currentGame.gameQueueConfigId) {
    return (
      <Panel
        header={gameType(currentGame.gameQueueConfigId)}
        collapsible
        defaultExpanded
        bsStyle="info"
      >
        <Table fill>
          <tbody>
            {renderParticipants(
              region,
              currentGame.participants,
              currentGame.gameQueueConfigId,
              rankedLeagues,
            )}
          </tbody>
        </Table>
      </Panel>
    );
  } else
    return (
      <Panel
        header={<h3>Current Game</h3>}
        collapsible
        defaultExpanded
        bsStyle="info"
      >
        Not Playing
      </Panel>
    );
};

const renderParticipants = (region, rows, queueTypeId, rankedLeagues) =>
  rows.map(row => renderParticipant(region, row, queueTypeId, rankedLeagues));

const renderParticipant = (region, row, queueTypeId, rankedLeagues) => (
  <tr key={row.summonerId}>
    <td>
      <i
        className={
          `${champ_icons['champion-' + row.championId]} ${championIcon.medium}`
        }
      />
    </td>
    <td>
      <Link to={`/${region}/${canonicalize(row.summonerName)}`}>
        {row.summonerName}
      </Link>
    </td>
    <td>{leagueInfo(rankedLeagues, row.summonerId)}</td>
    <td>{rankedWinLoss(queueTypeId, rankedLeagues, row.summonerId)}</td>
  </tr>
);

const leagueInfo = (rankedLeagues, summonerId) => {
  if (rankedLeagues[summonerId]) {
    return (
      <span>
        {rankedLeagues[summonerId][0]['tier']}{' '}
        {rankedLeagues[summonerId][0]['entries'][0]['division']}{' '}
        ({rankedLeagues[summonerId][0]['entries'][0]['leaguePoints']} LP)
      </span>
    );
  } else {
    <span>Not Placed</span>;
  }
};

export function canonicalize(name) {
  return name.replace(/\s/g, '').toLowerCase();
}

export default CurrentGame;
