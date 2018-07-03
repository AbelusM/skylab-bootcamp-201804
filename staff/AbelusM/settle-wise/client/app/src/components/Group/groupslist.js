import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {  CardBody, CardTitle, Card } from 'reactstrap';

class GroupsList extends Component {

    render() {
        return this.props.groups.map(group => <div className='link '>
            <Card className=''>
                <CardBody>
                    <Link to={`/groups/${group._id}`}>
                        <CardTitle>{group.name}</CardTitle>
                    </Link>
                </CardBody>
            </Card>
        </div>
        )
    }

}
export default GroupsList;