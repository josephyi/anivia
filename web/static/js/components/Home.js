import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {loadFeaturedGames, resetErrorMessage} from '../actions';
import FeaturedGames from '../components/FeaturedGames';
import {Grid, Row, Col, Jumbotron} from 'react-bootstrap';

function loadData(props) {
  props.resetErrorMessage();
  props.loadFeaturedGames(props.region);
}

class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.region !== this.props.region) loadData(nextProps);
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12} md={12}>
            <Jumbotron>
              <h1>Let's soar.</h1>
              <p>
                Anivia is an open source single page web application built with a React/Redux frontend, Elixir/Phoenix backend, and data
                from Riot Games'
                {' '}
                <a target="new" href="https://developer.riotgames.com/">
                  League of Legends API
                </a>
                .
              </p>
              <p>
                Check out the source at
                {' '}
                <a href="https://github.com/josephyi/anivia">
                  https://github.com/josephyi/anivia
                </a>
              </p>
            </Jumbotron>

            <h1>Featured Games</h1>
            <FeaturedGames
              featuredGames={this.props.featuredGames['gameList']}
              region={this.props.region}
              rankedLeagues={this.props.rankedLeagues}
              summoners={this.props.summoners}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const {form: {searchForm}} = state;
  const region = searchForm.region.value;

  const data = state.entities[region];

  if (data === undefined || data['featuredGames'] === undefined) {
    return {region, featuredGames: {}};
  }

  return {
    region,
    featuredGames: data['featuredGames'],
    rankedLeagues: data['rankedLeagues'],
    summoners: data['summoners'],
  };
}

export default connect(mapStateToProps, {loadFeaturedGames, resetErrorMessage})(
  Home,
);
