import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Header from '../components/Header'
import SearchForm from '../components/SearchForm'
import { loadSummoner, resetErrorMessage  } from '../actions'
import { browserHistory } from 'react-router'
import { Alert } from 'react-bootstrap'

class App extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleAlertDismiss = this.handleAlertDismiss.bind(this)
    }

    handleSubmit(data, dispatch) {
        this.props.loadSummoner(data.region, data.summonerName)
    }

    // handle new search
    componentDidUpdate(prevProps) {
        const { summoner, searchForm, canonicalSummonerName } = this.props
        const summonerChanged = summoner.name !== prevProps.summoner.name && summoner.id !== prevProps.summoner.id

        // TODO: implement a better way to do this
        if(summonerChanged && searchForm && searchForm.region && searchForm.region.value) {
            browserHistory.push(`/${searchForm.region.value}/${canonicalSummonerName}`)
        }
    }

    handleAlertDismiss() {
        this.props.resetErrorMessage()
    }

    renderErrorMessage() {
        const { errorMessage } = this.props
        if (!errorMessage) {
            return null
        }

        return (
            <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss} >
                <p>{errorMessage}</p>
            </Alert>
        )
    }

    render() {
        return (
            <div>
                <Header />
                <div className="container">
                    <div className="row clearfix">
                        <div className="col-md-8 col-md-offset-4">
                            <SearchForm onSubmit={this.handleSubmit} />
                        </div>
                    </div>
                {this.renderErrorMessage()}
                {this.props.children}
                </div>
            </div>

        )
    }
}

function mapStateToProps(state) {
    const {entities: {summoner}, form: {searchForm}} = state

    const canonicalSummonerName = summoner.name.toLowerCase()
    return {
        errorMessage: state.errorMessage,
        summoner,
        searchForm,
        canonicalSummonerName
    }
}

export default connect(mapStateToProps, { loadSummoner, resetErrorMessage })(App)
