import React, {Component, PropTypes} from 'react'
import {render} from 'react-dom'
import {loadSummoner} from '../actions'
import {connect} from 'react-redux'
import {Grid, Row, Col, Table, Panel} from 'react-bootstrap'
import Profile from '../components/Profile'
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
        const {summoner, currentGame, recentGames, rankedLeagues, rankedStats, aggregateRankedStats, region} = this.props
        if (summoner && summoner.name) {
            return (
                <Grid >
                    <Row>
                        <Col xs={12} md={3}>
                            <Profile aggregateRankedStats={ aggregateRankedStats } summoner={ summoner } rankedLeagues={ rankedLeagues } />
                        </Col>
                        <Col xs={12} md={9}>
                            <CurrentGame currentGame={currentGame} region={region} rankedLeagues={ rankedLeagues } />
                            <RecentGames fill recentGames={ recentGames }/>
                            <RankedStats rankedStats={ rankedStats } summoner={ summoner } />
                        </Col>
                    </Row>
                </Grid>
            )
        } else {
            return (
                <Grid>
                    <Row>
                        <Col xs={12} md={12}>
                        Loading...
                        </Col>
                    </Row>
                </Grid>
            )
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

    const {summoners, currentGamesMap, currentGames, aggregateRankedStatsData,
        rankedStatsData, rankedLeagues, recentGamesData} = data

    const summoner = summoners ? summoners[summonerName] : {}
    const currentGameId = summoner && currentGamesMap ? currentGamesMap[summoner.id] : null
    const currentGame = currentGameId ? currentGames[currentGameId] : {}

    return {
        currentGame,
        region,
        summonerName,
        summoner,
        rankedStats: summoner && rankedStatsData[summoner.id] ? rankedStatsData[summoner.id] : [],
        recentGames: summoner && recentGamesData[summoner.id] ? recentGamesData[summoner.id] : [],
        aggregateRankedStats: summoner ? aggregateRankedStatsData[summoner.id] : {},
        rankedLeagues
    }
}


export default connect(mapStateToProps, {loadSummoner})(SummonerPage)