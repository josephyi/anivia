import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'

export const fields = ['region', 'summonerName']

const validate = values => {
    const errors = {}
    if (!values.summonerName) {
        errors.summonerName = 'Required'
    }
    return errors
}

class SearchForm extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { fields: { region, summonerName }, error, handleSubmit, submitting } = this.props
        return (<form className="form-inline " onSubmit={handleSubmit}>
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

    saveForm(data, dispatch) {
        dispatch(loadSummoner(data.region, data.summonerName))


    }
}

SearchForm.propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    submitting: PropTypes.bool.isRequired
}


export default reduxForm({
    form: 'searchForm',
    fields,
    validate
})(SearchForm);