import React, { Component } from 'react'
import { Link, Route, withRouter } from 'react-router-dom'
// import React, { Component } from 'react'
import Group from './group'
import logic from '../logic'
import Home from './home'

class GroupsList extends Component {
    render() {
        return this.props.groups.map(group => <div>
            <Link to={`/groups/${group._id}`}>
                {group.name}
            </Link>
        </div>)
    }

}
export default GroupsList;