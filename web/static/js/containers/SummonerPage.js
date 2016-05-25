import React, {Component, PropTypes} from 'react'
import {render} from 'react-dom'
import {loadSummonerDetail} from '../actions'
import {connect} from 'react-redux'
import {Grid, Row, Table} from 'react-bootstrap'

function loadData(props) {
    console.log("loadData")
    console.log(props)
    const {region} = props.params
    const {summoner} = props
    props.loadSummonerDetail(region, summoner.id)
}

function renderRankedStatsRow(champion) {
    return (<tr key={champion.id}>
        <td><img width={16} height={16}
                 src={`http://ddragon.leagueoflegends.com/cdn/6.10.1/img/champion/${champion.image.full}`}/>{champion.name}
        </td>
        <td>{champion.totalSessionsWon}</td>
        <td>{champion.totalSessionsLost}</td>
        <td>{`${Math.round(champion.totalSessionsWon / champion.totalSessionsPlayed * 100)}%`}</td>
        <td>{`${(champion.totalChampionKills/champion.totalSessionsPlayed).toFixed(2)}/${(champion.totalDeathsPerSession/champion.totalSessionsPlayed).toFixed(2)}/${(champion.totalAssists/champion.totalSessionsPlayed).toFixed(2)}`}
            <br/>{champion.totalDeathsPerSession > 0 ? ((champion.totalChampionKills + champion.totalAssists) / champion.totalDeathsPerSession).toFixed(2) : "Perfect"}</td>
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

    componentWillReceiveProps(nextProps) {
        const {region, summonerName} = this.props.params
        if (nextProps.params.region !== region || nextProps.params.summonerName !== summonerName)
            loadData(nextProps)
    }


    render() {
        const {summoner, rankedStats} = this.props
        return (
            <div>
                <h1>{summoner.name}</h1>
                <Table striped hover>
                    <thead>
                    <tr>
                        <th>Champion</th>
                        <th>Win</th>
                        <th>Loss</th>
                        <th>Win Percentage</th>
                        <th>KDA</th>
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
    loadSummonerDetail: PropTypes.func.isRequired,
    summoner: PropTypes.object,
    rankedStats: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    const {entities: {summoner, rankedStats, recentGames}} = state
    return {
        summoner, rankedStats, recentGames
    }
}


export default connect(mapStateToProps, {loadSummonerDetail})(SummonerPage)