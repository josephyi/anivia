import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { loadSummoner } from '../actions'
import { connect } from 'react-redux'

function loadData(props) {
    const { region, summonerName } = props.params
    props.loadSummoner(region, summonerName)
}

class SummonerPage extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        loadData(this.props)
    }

    componentWillReceiveProps(nextProps) {
        const {nextRegion, nextSummonerName} = nextProps.params
        const {region, summonerName} = this.props.params
        if(nextRegion !== region || nextSummonerName !== summonerName)
          loadData(nextProps)
    }

    render() {
        return(
            <div>
            <h1>{this.props.summoner.name}</h1>
                <div>
                    {this.props.summoner.summonerLevel}
                    </div>
            </div>
        )
    }
}

SummonerPage.propTypes = {
    loadSummoner: PropTypes.func.isRequired,
    summoner: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    console.log("mapStateToProps")
    console.log(state)
    const { summoner, rankedStats } = state
    console.log(summoner)
    return {
        summoner, rankedStats
    }
}


export default connect(mapStateToProps, {loadSummoner})(SummonerPage)