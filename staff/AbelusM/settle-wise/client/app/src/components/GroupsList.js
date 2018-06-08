import React from 'react'

function GroupsList(props) {
    return props.groups.map(group => <div>{group.name}</div>)
}

export default GroupsList;