import React, { Component } from 'react'
import Group from './group'
import { logicalExpression } from 'babel-types';

class Spend extends Component {
    state = {
        groups: [],
        groupId: '',
        spends: []
    }

    componentWillReceiveProps() {
        this.listSpends()
    }

    listSpends(){
        return logic.listSpends(this.groupId)
        this.state.spends.map(spend => <div> {spend}
        </div>)
    }
    render() {
        return <main id="banner">
            <section id="main" className="wrapper">
                <div className="inner">
                    {this.listSpends}
                </div>
            </section>
        </main>
    }

}

export default Spend