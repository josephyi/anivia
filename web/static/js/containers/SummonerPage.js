import React, {Component, PropTypes} from 'react'
import {render} from 'react-dom'
import {loadSummoner} from '../actions'
import {connect} from 'react-redux'
import {Grid, Row, Col, Table, Panel} from 'react-bootstrap'
import AggregateRankedStats from '../components/AggregateRankedStats'
import RankedStats from '../components/RankedStats'
import RecentGames from '../components/RecentGames'
import CurrentGame from '../components/CurrentGame'

function loadData(props, forced = false) {
    const {region, summonerName} = props
    const {summoner} = props

    if (summoner.id === undefined || forced) {
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

    componentWillReceiveProps(nextProps) {
        const {aggregateRankedStats} = nextProps
        if (aggregateRankedStats === undefined) {
            loadData(nextProps, true)
        }
    }

    render() {
        const {summoner, currentGame, recentGames, rankedStats, aggregateRankedStats, region} = this.props
        if (summoner && summoner.name) {
            return (
                <div>
                    <Grid>
                        <Row>
                            <Col xs={6} md={4} >
                                <h2>{summoner.name || ""}</h2>
                                    <img
                                        src={`http://ddragon.leagueoflegends.com/cdn/6.10.1/img/profileicon/${summoner.profileIconId || '666'}.png`}/>
                                    <AggregateRankedStats aggregateRankedStats={ aggregateRankedStats }/>

                            </Col>
                            <Col xs={12} md={8}>
                                <Panel header={<h3>Current</h3>} collapsible defaultExpanded>
                                  <CurrentGame currentGame={ currentGame } region={region}/>
                                </Panel>
                            </Col>
                        </Row>
                    </Grid>
                    <Grid>
                        <Row>
                            <Col xs={12} md={12}>
                    <Panel header={<h3>Recent Games</h3>} collapsible defaultExpanded>
                        <RecentGames fill recentGames={ recentGames }/>
                    </Panel></Col>
                        </Row>
                    </Grid>
                    <Grid>
                        <Row>
                            <Col xs={12} md={12}>
                    <Panel header={<h3>Ranked Stats</h3>} collapsible defaultExpanded>
                        <RankedStats fill rankedStats={ rankedStats }/>
                    </Panel></Col></Row></Grid>
                </div>
            )
        } else {
            return (<div>loading...</div>)
        }
    }
}

SummonerPage.propTypes = {
    loadSummoner: PropTypes.func.isRequired,
    summoner: PropTypes.object,
    rankedStats: PropTypes.array,
    aggregateRankedStats: PropTypes.object
}

function mapStateToProps(state, ownProps) {
    const region = ownProps.params.region
    const summonerName = ownProps.params.summonerName

    const data = state.entities[region]

    if (data === undefined || data["summoners"] === undefined || data["summoners"][summonerName] === undefined) {
        return {region, summoner: {}, summonerName, rankedStats: [], aggregateRankedStats: {}}
    }

    const {summoners, currentGamesMap, currentGames, aggregateRankedStatsData, rankedStatsData, recentGamesData} = data

    const summoner = summoners ? summoners[summonerName] : {}
    const currentGameId = summoner && currentGamesMap ? currentGamesMap[summoner.id] : null
    const currentGame = currentGameId ? currentGames[currentGameId] : {}

    return {
        currentGame,
        region,
        summonerName,
        summoner,
        // rankedLeague,
        rankedStats: summoner && rankedStatsData[summoner.id] ? rankedStatsData[summoner.id] : [],
        recentGames: summoner && recentGamesData[summoner.id] ? recentGamesData[summoner.id] : [],
        aggregateRankedStats: summoner ? aggregateRankedStatsData[summoner.id] : {}
    }
}


export default connect(mapStateToProps, {loadSummoner})(SummonerPage)