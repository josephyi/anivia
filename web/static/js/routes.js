import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import Home from './components/Home'
import SummonerPage from './containers/SummonerPage'
import AboutPage from './containers/AboutPage'

export default (
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/about" component ={AboutPage}></Route>
        <Route path="/:region/:summonerName" component={SummonerPage}></Route>
    </Route>
)