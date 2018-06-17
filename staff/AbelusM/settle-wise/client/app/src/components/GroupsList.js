import React, { Component } from 'react'
import { Link, Route, withRouter } from 'react-router-dom'
// import React, { Component } from 'react'
import Group from './group'
import logic from '../logic'
import Home from './home'

// class GroupsList extends Component {
//     state = {
//         // groups: this.props
//     }

//     componentWillReceiveProps() {
//         logic.listGroups()
//             .then((groups) => this.setState({ groups }))
//             .then(() => this.showList())
//     }

//     showList() {
//         return this.props.groups.map(group => <div>
//             <button>
//                 {group.name}
//                 <Group groupId={group._id} /></button>
//         </div>)
//     }
//     render() {
//         return <main id="banner">
//             <section id="main" className="wrapper">
//                 <div className="inner">
//                     {this.showList}
//                 </div>
//             </section>
//         </main>
//     }

// }

// export default GroupsList

// componentWillReceiveProps
function GroupsList(groups) {
    return groups.groups.map(group => <div>
        <Link to='/groups'>
        {group.name}
        <Group groupId={group._id} />
        </Link>
        </div>)
}

export default GroupsList;