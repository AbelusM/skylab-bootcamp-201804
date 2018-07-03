import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {  CardBody, CardTitle, Card } from 'reactstrap';
import './style.css'

class GroupsList extends Component {

    render() {
        return this.props.groups.map(group => <div className='link '>
            <Card className='group-card'>
                <CardBody>
                    <Link to={`/groups/${group._id}`}>
                        <CardTitle color="secondary">{group.name}</CardTitle>
                    </Link>
                </CardBody>
            </Card>
        </div>
        )
    }

}
export default GroupsList;