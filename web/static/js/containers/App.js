import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import SearchForm from '../components/SearchForm'

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div><h1>wired!</h1>
                <SearchForm  />
                {this.props.children}
            </div>

        )
    }
}

export default connect()(App)
