import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'
export const fields = ['region', 'summonerName']

class SearchForm extends Component {
    render() {
        const { fields: { region, summonerName }, error, handleSubmit, submitting } = this.props
        return (<form className="form-horizontal " onSubmit={handleSubmit}>
                <div>
                    <label>Region</label>
                    <div>
                        <input type="text" placeholder="Region" {...region}/>
                    </div>
                    {region.touched && region.error && <div>{region.error}</div>}
                </div>
                <div>
                    <label>Summoner Name</label>
                    <div>
                        <input type="text" placeholder="Summoner Name" {...summonerName}/>
                    </div>
                    {summonerName.touched && summonerName.error && <div>{summonerName.error}</div>}
                </div>
                {error && <div>{error}</div>}
                <div>
                    <button type="submit" disabled={submitting}>
                        {submitting ? <i/> : <i/>} Search
                    </button>
                </div>
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
    form: 'search',
    fields
})(SearchForm);