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
        fractions: [],
        result: []
    }

    addUserToGroup = e => {
        e.preventDefault()
        this.setState({
            email: e.target.value
        })
        const groupId = this.state.groupId.toString()

        logic.addUserToGroup(groupId, this.state.email)
            .then(() => console.log('user added to group'))
    }

    addSpend = e => {
        e.preventDefault()
        const amount = this.state.amount
        const payerId = this.state.payerId
        const fraction = this.state.fractions

        logic.addSpend(amount, payerId, fraction)
            .then(() => console.log('added a spend to the group'))
    }

    componentDidMount() {
        this.listUsers()
        this.listSpends()
    }

    listUsers = () => {
        const group = this.state.groupId
        console.log(group)

        logic.listUsers(group)
            .then(res => {
                this.setState({ users: res.users })
            })
    }

    listSpends() {
        const group = this.state.groupId.toString()

        logic.listSpends(group)
            .then(spends => {
                this.setState({
                    spends
                })
            })
    }

    catchUserName = e => {
        e.preventDefault()
        this.setState({
            email: e.target.value
        })
    }

    goBack = e => {
        e.preventDefault()
        this.props.history.push('/home')
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

    splitSpends() {
        const group = this.state.groupId.toString()

        logic.splitSpends(group)
            .then(balance => {
                this.setState({
                    result: balance
                })
            }).then(() => {
                // TODO move this to render
                return this.state.result.map(res => <div>
                    <label>{res}</label>
                </div>)
            })
    }

    render() {

        return <main id="banner">
            <section id="main" className="wrapper">
                <div className="inner">
                    <header className="align-center">
                        <h2>User's group</h2>
                    </header>
                    <section>
                        {this.state.users.map(user => <p>{user.name}</p>)}
                    </section>
                    <form>
                        <h2>Group Spends</h2>
                        {this.state.spends.map(res => <div>
                            <label>{res}</label>
                        </div>)}
                        <h2>Add a Spend</h2>
                        <input className="inner flex flex-3" type="text" onChange={this.state.amount} placeholder="new payment" />
                        <input className="inner flex flex-3" type="text" onChange={this.state.payerId} placeholder="payer" />
                        <button value={this.state.email} onChange={this.addSpend}>Add a Spend</button>
                    </form>
                    <form>
                        <h2>Add a User</h2>
                        <input className="inner flex flex-3" type="text" onChange={this.catchUserName} placeholder="user email" />
                        <button onClick={this.addUserToGroup}>Add User to Group</button>
                    </form>
                    <section>
                        <button onClick={this.splitSpends}>Split Spends</button>
                    </section>
                    <section>
                        <button onClick={this.goBack}>Go to Groups</button>
                    </section>
                </div>
            </section>
        </main>
    }

}

export default Group