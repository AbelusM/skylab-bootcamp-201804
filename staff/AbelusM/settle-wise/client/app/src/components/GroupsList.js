import React, {Component} from 'react'

// componentWillReceiveProps
function GroupsList(props) {
    return props.groups.map(group => <div>
        <button>
        {group.name}</button>
        </div>)
}

export default GroupsList;