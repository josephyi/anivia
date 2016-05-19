import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import SummonerPage from './containers/SummonerPage'
import SearchForm from './components/SearchForm'

export default (
    <Route path="/" component={App}>
        <Route path="/:region/:summonerName" component={SummonerPage}></Route>
    </Route>
)