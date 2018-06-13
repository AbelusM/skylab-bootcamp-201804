import React, {Component} from 'react'
import Group from './group'

// componentWillReceiveProps
function Spend(props) {
    return props.groups.map(group => <div>
        <button>
        {group.name}
        <Group groupId={group._id}/></button>
        </div>)
}

export default Spend;