import React, {Component, PropTypes} from 'react'
import {render} from 'react-dom'
import {loadSummoner} from '../actions'
import {connect} from 'react-redux'
import {Grid, Row, Table} from 'react-bootstrap'

function loadData(props) {
    const {region, summonerName} = props
    const {summoner} = props

    if(summoner.id === undefined) {
        props.loadSummoner(region, summonerName)
    }
}

function renderRankedStatsRow(champion) {
    return (<tr key={champion.id}>
        <td><img width={16} height={16}
                 src={`http://ddragon.leagueoflegends.com/cdn/6.10.1/img/champion/${champion.image.full}`}/>{' '}   {champion.name}
        </td>
        <td>{champion.totalSessionsWon}</td>
        <td>{champion.totalSessionsLost}</td>
        <td>{`${Math.round(champion.totalSessionsWon / champion.totalSessionsPlayed * 100)}%`}</td>
        <td className="text-center">{`${(champion.totalChampionKills/champion.totalSessionsPlayed).toFixed(2)}/${(champion.totalDeathsPerSession/champion.totalSessionsPlayed).toFixed(2)}/${(champion.totalAssists/champion.totalSessionsPlayed).toFixed(2)}`}
            <br />{champion.totalDeathsPerSession > 0 ? ((champion.totalChampionKills + champion.totalAssists) / champion.totalDeathsPerSession).toFixed(2) : "Perfect"}</td>
        <td>{Math.round(champion.totalMinionKills / champion.totalSessionsPlayed)}</td>
    </tr>)
}

class SummonerPage extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        loadData(this.props)
    }

    render() {
        const {summoner, rankedStats, aggregateRankedStats} = this.props
        return (
            <div>
                <h1>{summoner.name}</h1>
                <img src={`http://ddragon.leagueoflegends.com/cdn/6.10.1/img/profileicon/${summoner.profileIconId}.png`} />
                <h2>Ranked: {aggregateRankedStats.totalSessionsWon}W-{aggregateRankedStats.totalSessionsLost}L</h2>
                <h2>Ranked KDA: {(aggregateRankedStats.totalChampionKills/aggregateRankedStats.totalSessionsPlayed).toFixed(2)}
                    /{(aggregateRankedStats.totalDeathsPerSession/aggregateRankedStats.totalSessionsPlayed).toFixed(2)}
                    /{(aggregateRankedStats.totalAssists/aggregateRankedStats.totalSessionsPlayed).toFixed(2)},
                    {' '}{((aggregateRankedStats.totalChampionKills + aggregateRankedStats.totalAssists) / aggregateRankedStats.totalDeathsPerSession).toFixed(2)}:1
                </h2>
                <Table striped hover>
                    <thead>
                    <tr>
                        <th>Champion</th>
                        <th>Win</th>
                        <th>Loss</th>
                        <th>Win %</th>
                        <th className="text-center">KDA</th>
                        <th>Avg CS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rankedStats.map(renderRankedStatsRow)}
                    </tbody>
                </Table>
            </div>
        )
    }
}

SummonerPage.propTypes = {
    loadSummoner: PropTypes.func.isRequired,
    summoner: PropTypes.object,
    rankedStats: PropTypes.array.isRequired
}

function mapStateToProps(state, ownProps) {
    const region = ownProps.params.region
    const summonerName = ownProps.params.summonerName

    if (state.entities[region] === undefined || state.entities[region][summonerName] === undefined)
        return {region, summoner: {}, summonerName, rankedStats: []}

    const {summoner, rankedStats, recentGames, aggregateRankedStats} = state.entities[region][summonerName]
    return {
        region,
        summonerName,
        summoner,
        rankedStats,
        recentGames,
        aggregateRankedStats
    }
}


export default connect(mapStateToProps, {loadSummoner})(SummonerPage)