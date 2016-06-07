import React, {Component, PropTypes} from 'react'
import {render} from 'react-dom'
import {loadSummoner} from '../actions'
import {connect} from 'react-redux'
import {Grid, Row, Table} from 'react-bootstrap'
import RankedStats from '../components/RankedStats'
import RecentGames from '../components/RecentGames'

function loadData(props) {
    const {region, summonerName} = props
    const {summoner} = props

    if(summoner.id === undefined) {
        props.loadSummoner(region, summonerName)
    }
}

class SummonerPage extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        loadData(this.props)
    }

    render() {
        const {summoner, recentGames, rankedStats, aggregateRankedStats} = this.props
        if(summoner.name) {
        return (
            <div>
                <h1>{summoner.name || ""}</h1>
                <img src={`http://ddragon.leagueoflegends.com/cdn/6.10.1/img/profileicon/${summoner.profileIconId || '666'}.png`} />
                <h2>Ranked: {aggregateRankedStats.totalSessionsWon || '0'}W-{aggregateRankedStats.totalSessionsLost || '0'}L</h2>
                <h2>Ranked KDA: {(aggregateRankedStats.totalChampionKills/aggregateRankedStats.totalSessionsPlayed).toFixed(2)}
                    /{(aggregateRankedStats.totalDeathsPerSession/aggregateRankedStats.totalSessionsPlayed).toFixed(2)}
                    /{(aggregateRankedStats.totalAssists/aggregateRankedStats.totalSessionsPlayed).toFixed(2)},
                    {' '}{((aggregateRankedStats.totalChampionKills + aggregateRankedStats.totalAssists) / aggregateRankedStats.totalDeathsPerSession).toFixed(2)}:1
                </h2>
                <RecentGames recentGames={ recentGames } />
                <RankedStats rankedStats={ rankedStats } />
            </div>
        )} else { return (<div>loading...</div>)}
    }
}

SummonerPage.propTypes = {
    loadSummoner: PropTypes.func.isRequired,
    summoner: PropTypes.object,
    rankedStats: PropTypes.array.isRequired,
    aggregateRankedStats: PropTypes.object
}

function mapStateToProps(state, ownProps) {
    const region = ownProps.params.region
    const summonerName = ownProps.params.summonerName

    if (state.entities[region] === undefined || state.entities[region][summonerName] === undefined)
        return {region, summoner: {}, summonerName, rankedStats: [], aggregateRankedStats: {}}

    const {summoner, rankedLeague, rankedStats, recentGames, aggregateRankedStats} = state.entities[region][summonerName]
    return {
        region,
        summonerName,
        summoner,
        rankedLeague,
        rankedStats,
        recentGames,
        aggregateRankedStats
    }
}


export default connect(mapStateToProps, {loadSummoner})(SummonerPage)