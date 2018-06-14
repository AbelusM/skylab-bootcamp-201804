import React, { Component } from 'react'
import Group from './group'
import Home from './home'

class GroupsList extends Component {
    state = {
        groups: []
    }

    componentWillReceiveProps() {
        // return this.showList()
    }
 
    // showList(){
    //     return this.state.groups.map(group => <div>
    //         <button>
    //             {group.name}
    //             <Group onClick={this.state.groups} groupId={group._id} /></button>
    //     </div>)
    // }
    render() {
        return <main id="banner">
            <section id="main" className="wrapper">
                <div className="inner">
                    {this.showList}
                </div>
            </section>
        </main>
    }

}

export default GroupsList

// componentWillReceiveProps
// function GroupsList(props) {
//     return props.groups.map(group => <div>
//         <button>
//         {group.name}
//         <Group groupId={group._id}/></button>
//         </div>)
// }

// export default GroupsList;