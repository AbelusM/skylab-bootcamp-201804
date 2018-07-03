import React, { Component } from 'react'
import { Link, Route, withRouter } from 'react-router-dom'
import Group from './group'
import logic from '../logic'
import Home from './home'
import { Alert } from 'reactstrap';

class GroupsList extends Component {
 
    
    render() {
        return this.props.groups.map(group => <div className='link'>
            <Link  to={`/groups/${group._id}`}>
                {group.name}gghh
            </Link>
        </div>)
    }

}
export default GroupsList;