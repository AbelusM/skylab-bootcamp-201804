import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logic from '../logic'
import '../styles/assets/css/main.css'
import surfgroup from '../styles/images/surfgroup.jpg'
import GroupsList from './GroupsList'
import { ParseOptions } from 'querystring';

class Group extends Component {
    state = {
        users: [],
        spends: [],
        email: '',
        groupId: this.props.match.params.groupId,
        amount: 0,
        payerId: '',
        checkPayer: false,
        fractions: [],
        balance: [],
        newUser: '',
        checkUser: false,
        userId: ''
    }

    addUserToGroup = e => {
        e.preventDefault()
        this.setState({
            email: e.target.value
        })
        const groupId = this.state.groupId.toString()

        logic.addUserToGroup(groupId, this.state.email)
            .then(() => console.log('user added to group'))
            .then(newUser => this.setState({ newUser }))
    }

    addSpend = e => {
        e.preventDefault()
        let payerId
        if (this.state.checkPayer)
             payerId = this.state.payerId

        const amount = this.state.amount

        let userId
        if (this.state.checkUser)
             userId = this.state.userId

        e = this.setState({ userId, fractions: e })

        logic.addSpend(amount, payerId, this.state.fractions)
            .then(() => console.log('added a spend to the group'))
    }

    catchAmount = e => {
        e.preventDefault()
        const amount = parseInt(e.target.value)
        this.setState({ amount })
    }

    catchPayer = e => {
        e.preventDefault()
        this.setState({ payerId: e.target.value })
    }

    componentDidMount() {
        this.listUsers()
        this.listSpends()
    }

    listUsers = () => {
        const group = this.state.groupId

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
                this.setState({ balance })
            })
    }

    render() {

        return <main id="banner">
            <section id="main" className="wrapper">
                <div className="inner">
                    <form>
                        <h2>Group Spends</h2>
                        {this.state.spends.map(res => <div>
                            <label>{res}</label>
                        </div>)}
                    </form>
                    <section>
                        <h2>User's group</h2>
                        {this.state.users.map(user => <div className='banner'>
                            <label className='groupInput'>{user.name}</label>
                            <input value={user._id.toString()} onClick={userId => this.setState({ checkUser: true, userId })} className='' type="checkbox" />
                            <input value={user._id.toString()} onClick={userId => this.setState({ checkPayer: true, payerId: userId })} className='' type="checkbox" />
                        </div>
                        )}
                        <input className="groupInput" type="text" onChange={this.catchAmount} placeholder="new payment amount" />
                        <button onClick={this.addSpend}>Add a Spend</button>
                    </section>
                    <form>
                        <h2>Add a User</h2>
                        <input className="inner flex flex-3" type="text" onChange={this.catchUserName} placeholder="user email" />
                        <button onClick={this.addUserToGroup}>Add User to Group</button>
                    </form>
                    <section>
                        <button onClick={this.state.balance.map(res => <div>
                            <label>{res}</label>
                        </div>)}>Split Spends</button>
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