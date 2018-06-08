import React, {Component} from 'react'
import logic from '../logic'

class GroupsList extends Component {
    constructor() {
        super()
        this.state = {
            groups: []
        }
    }

    componentWillMount(userId) {
        logic.listGroupsByUser(userId)
            .then(groups => this.setState(groups.name))
    }

    render() {
        return (this.state.groups.length > 0 ? this.state.groups.map(groups => {
            return (
                <div>{groups.name}</div>
            )
        }) : null

        )
    }
}

export default GroupsList;