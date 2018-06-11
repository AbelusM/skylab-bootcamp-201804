import React from 'react'

function GroupsList(props) {
    return props.groups.map(group => <div><ul>
        `<li>{group.name}</li>`
        </ul></div>)
}

export default GroupsList;