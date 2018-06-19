import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logic from '../logic'
import '../styles/assets/css/main.css'
import surfgroup from '../styles/images/surfgroup.jpg'
import GroupsList from './GroupsList'
// import Spend from './Spend'

class Group extends Component {
    state = {
        users: [],
        spends: [],
        email: '',
        groupId: '',
        amount: 0,
        payerId: '',
        fractions: []
    }

    componentDidMount() {
        // this.listUsers()
        if (this.props.groupId) this.listSpends()

        // logic.listSpends(this.state.groupId)
        //     .then((spends) => this.setState({ spends }))
    }

    addUserToGroup = e => {
        e.preventDefault()
        const email = this.state.email
        const groupId = this.state.groupId.toString()

        logic.addUserToGroup(groupId, email)
            .then(() => console.log('user added to group'))
            .then(() => {
                this.setState.email = ''
                this.setState.groupId = ''
            })
    }

    addSpend = e => {
        e.preventDefault()
        const amount = this.state.amount
        const payerId = this.state.payerId
        const fraction = this.state.fractions

        logic.addSpend(amount, payerId, fraction)
            .then(() => console.log('added a spend to the group'))
            .then(() => {
                this.setState.email = ''
                this.setState.groupId = ''
            })
    }

    listUsers() {
        const group = this.props.groupId.toString()

        if (typeof group !== undefined) {
            logic.listUsers(group)
                .then(user => {
                    this.setState({
                        users: user.users
                    })
                    this.setState.groupId = ''
                }).then(() => {
                    return this.state.users.map(res => <div>
                        <label>{res}</label>
                    </div>)
                })
        }
    }

    listSpends() {
        const group = this.props.groupId.toString()

        if (typeof group !== undefined) {
            logic.listSpends(group)
                .then(spend => {
                    this.setState({
                        spends: spend
                    })
                    this.setState.groupId = ''
                }).then(() => {
                    return this.state.spends.map(res => <div>
                        <label>{res}</label>
                    </div>)
                })
        }
    }

    catchUserName = e => {
        e.preventDefault()
        this.setState({
            email: e.target.value
        })
    }

    catchGroupId = e => {
        e.preventDefault()
        this.setState({
            groupId: e.target.value
        })
    }

    submit = (e) => {
        e.preventDefault()
    }

    render() {
        return <main id="banner">
            <section id="main" className="wrapper">
                <div className="inner">
                    <header className="align-center">
                        <h1>Users</h1>
                    </header>
                    <section>
                        {this.listUsers}
                        {this.listSpends}
                    </section>
                    <form>
                        <input className="inner flex flex-3" type="text" onChange={this.catchUserName} placeholder="new payment" />
                        <input className="inner flex flex-3" type="text" onChange={this.catchUserName} placeholder="user email" />
                        <button value={this.email} onChange={this.addSpend}>Add a Spend</button>
                    </form>
                    <form>
                        <input className="inner flex flex-3" type="text" onChange={this.catchUserName} placeholder="user email" />
                        <button value={this.email} onChange={this.addUserToGroup}>Add User to Group</button>
                    </form>
                    <section>
                        <button value={this.email} onChange={this.splitSpends}>Split Spends</button>
                    </section>
                </div>
            </section>
        </main>
    }

}

export default Group