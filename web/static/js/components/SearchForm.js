import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { browserHistory } from 'react-router'
import { loadSummoner } from '../actions'
export const fields = ['region', 'summonerName']

class SearchForm extends Component {
    constructor(props) {
        super(props)
        this.saveForm = this.saveForm.bind(this)
    }

    render() {
        const { fields: { region, summonerName }, error, handleSubmit, submitting } = this.props
        return (<form className="form-inline " onSubmit={handleSubmit(this.saveForm)}>
                <div className="form-group">
                    <label className="sr-only">Region</label>
                    <input type="text" className="form-control" placeholder="Region" {...region}/>
                    {region.touched && region.error && <div>{region.error}</div>}
                </div>
                <div className="form-group">
                    <label className="sr-only">Summoner Name</label>
                    <input type="text" className="form-control" placeholder="Summoner Name" {...summonerName}/>
                    {summonerName.touched && summonerName.error && <div>{summonerName.error}</div>}
                </div>
                {error && <div>{error}</div>}

                    <button className="btn btn-primary" type="submit" disabled={submitting}>
                        {submitting ? <i/> : <i/>} Search
                    </button>

            </form>
        )
    }

    saveForm(data) {
        browserHistory.push(`/${data.region}/${data.summonerName}`)
    }
}

SearchForm.propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    submitting: PropTypes.bool.isRequired
}


export default reduxForm({
    form: 'search',
    fields
})(SearchForm);