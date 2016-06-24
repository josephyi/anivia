import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadFeaturedGames, resetErrorMessage } from '../actions'
import FeaturedGames from '../components/FeaturedGames'
import { Grid, Row, Col } from 'react-bootstrap'

function loadData(props) {
    props.resetErrorMessage()
    props.loadFeaturedGames(props.region)
}

class Home extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        loadData(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.region !== this.props.region)
            loadData(nextProps)
    }

    render() {
        return(
            <Grid><Row>
                <Col xs={12} md={12}>
            <FeaturedGames featuredGames={this.props.featuredGames["gameList"]} region={this.props.region} rankedLeagues={this.props.rankedLeagues} />
            </Col></Row></Grid>
        )
    }
}

function mapStateToProps(state) {
    const {form: {searchForm}} = state
    const region = searchForm.region.value

    const data = state.entities[region]

    if (data === undefined || data["featuredGames"] === undefined) {
        return {region, featuredGames: {}}
    }

    return {
        region,
        featuredGames: data["featuredGames"],
        rankedLeagues: data["rankedLeagues"]
    }
}

export default connect(mapStateToProps, { loadFeaturedGames, resetErrorMessage })(Home)