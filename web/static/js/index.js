// Phoenix' dependencies
import '../../../deps/phoenix/priv/static/phoenix'
import '../../../deps/phoenix_html/priv/static/phoenix_html'

// Shiny new, hot React component
import React, { Component } from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

const rootEl = document.getElementById('root')
const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

render(<AppContainer>
    <Root store={store} history={history} />
</AppContainer>, rootEl);

if (module.hot) {
    module.hot.accept('./containers/Root', () => {
        // If you use Webpack 2 in ES modules mode, you can
        // use <App /> here rather than require() a <NextApp />.
        const NextApp = require('./containers/Root').default;
        render(
            <AppContainer>
                <NextApp store={store} history={history} />
            </AppContainer>,
            rootEl
        );
    });
}
