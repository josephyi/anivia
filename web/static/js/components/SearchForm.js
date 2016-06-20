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
        return (<form className="navbar-form navbar-right" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label className="sr-only">Summoner Name</label>
                    <input type="text" className="form-control" placeholder="Summoner Name" {...summonerName}/>
                    {summonerName.touched && summonerName.error && <div>{summonerName.error}</div>}
                </div>
                {' '}
                <div className="form-group">
                    <select className="form-control" {...region} >
                        <option value="br">BR</option>
                        <option value="eune">EUNE</option>
                        <option value="euw">EUW</option>
                        <option value="kr">KR</option>
                        <option value="lan">LAN</option>
                        <option value="las">LAS</option>
                        <option value="na">NA</option>
                        <option value="oce">OCE</option>
                        <option value="ru">RU</option>
                        <option value="tr">TR</option>
                        <option value="pbe">PBE</option>
                    </select>
                </div>
                {' '}
                {error && <div>{error}</div>}

                    <button className="btn btn-primary" type="submit" disabled={submitting}>
                        {submitting ? <i/> : <i/>} Search
                    </button>

            </form>
        )
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
    validate,
    initialValues: {
        region: 'na'
    }
})(SearchForm);