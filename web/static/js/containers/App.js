import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import SearchForm from '../components/SearchForm'
import { loadSummoner } from '../actions'
import { browserHistory } from 'react-router'

class App extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(data, dispatch) {
        this.props.loadSummoner(data.region, data.summonerName)

    }

    componentDidUpdate(prevProps, prevState) {
        const { summoner, searchForm } = this.props
        const summonerChanged = summoner.name !== prevProps.summoner.name && summoner.id !== prevProps.summoner.id

        if(summonerChanged) {
            browserHistory.push(`/${searchForm.region.value}/${summoner.name}`)
        }
    }

    render() {
        return (
            <div><h1>wired!</h1>
                <SearchForm onSubmit={this.handleSubmit} />
                {this.props.children}
            </div>

        )
    }
}

function mapStateToProps(state) {
    const {entities: {summoner}, form: {searchForm}} = state
    return {
        errorMessage: state.errorMessage,
        summoner, searchForm
    }
}

export default connect(mapStateToProps, { loadSummoner })(App)
