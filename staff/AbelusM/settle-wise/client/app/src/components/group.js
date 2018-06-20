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
        groupId: this.props.match.params.groupId,
        amount: 0,
        payerId: '',
        fractions: []
    }

    componentDidMount() {
        this.listUsers()
    }

    addUserToGroup = e => {
        e.preventDefault()
        this.setState({
            email: e.target.value
        })
        const groupId = this.state.groupId.toString()

        logic.addUserToGroup(groupId, this.state.email)
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

    listUsers = () => {
        const group = this.state.groupId.toString()

        logic.listUsers(group)
            .then((users) => {
                return users.users.map(user => <p>{user.email}</p>
                )
            })
    }

    listSpends() {
        const group = this.state.groupId.toString()

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
                        <h3>User's group</h3>
                    </header>
                    <section>
                        {this.listUsers}
                    </section>
                    <form>
                        <h3>Group Spends</h3>
                        {this.listSpends}
                        <input className="inner flex flex-3" type="text" onChange={this.state.amount} placeholder="new payment" />
                        <input className="inner flex flex-3" type="text" onChange={this.state.payerId} placeholder="payer" />
                        <input className="inner flex flex-3" type="text" onChange={this.state.fractions} placeholder="fractions" />
                        <button value={this.state.email} onChange={this.addSpend}>Add a Spend</button>
                    </form>
                    <form>
                        <h3>Add User</h3>
                        <input className="inner flex flex-3" type="text" onChange={this.catchUserName} placeholder="user email" />
                        <button value={this.state.email} onClick={this.addUserToGroup}>Add User to Group</button>
                    </form>
                    <section>
                        <button onClick={this.splitSpends}>Split Spends</button>
                    </section>
                </div>
            </section>
        </main>
    }

}

export default Group