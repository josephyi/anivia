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
        this.props.resetErrorMessage()
        this.props.loadSummoner(data.region, data.summonerName)
        browserHistory.push(`/${data.region}/${data.summonerName.toLowerCase()}`)
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
                <Header handleSubmit={ this.handleSubmit }/>
                <div className="container">
                    <div className="row clearfix">
                        <div className="col-md-8 col-md-offset-4">
                           
                        </div>
                    </div>
                </div>
                {this.renderErrorMessage()}
                {this.props.children}

            </div>

        )
    }
}

function mapStateToProps(state, ownProps) {
    const { region, summonerName } = ownProps.params

    const {form: {searchForm}} = state


    if (state.entities[region] === undefined)
      return { errorMessage: state.errorMessage, searchForm, summoner: {} }

    const summoner = state.entities[region]["summoners"][summonerName]
    return {
        errorMessage: state.errorMessage,
        summoner: summoner ? summoner["summoner"] || {} : {},
        searchForm
    }
}

export default connect(mapStateToProps, { loadSummoner, resetErrorMessage })(App)
