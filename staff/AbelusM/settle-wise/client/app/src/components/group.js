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
        participants: {},
        amounts: {},
        balance: [],
        newUser: ''
    }

    addUserToGroup = e => {
        e.preventDefault()

        const { groupId, email } = this.state

        logic.addUserToGroup(groupId, email)
            .then(() => console.log('user added to group'))
            .then(newUser => this.setState({ newUser }))
    }

    handlerAddUser = e => {
        e.preventDefault()

        this.setState({
            email: e.target.value
        })
    }

    addSpend = e => {
        e.preventDefault()

        const { groupId, payerId, amount, participants, amounts } = this.state

        const fractions = []

        var userIds = Object.keys(participants)

        userIds.forEach(userId => {
            fractions.push({ "user": userId, "amount": amounts[userId] })
        })

        logic.addSpend(groupId, amount, payerId, fractions)
            .then(() => console.log('added a spend to the group'))
            .catch(console.error)
    }

    catchAmount = e => {
        e.preventDefault()
        const amount = parseInt(e.target.value)
        this.setState({ amount })
    }

    selectPayer = payerId => {
        this.setState({ payerId })
    }

    selectParticipant = userId => {
        this.setState(prevState => {
            const { participants } = prevState

            participants[userId] = true

            return { participants }
        })
    }

    unselectParticipant = userId => {
        this.setState(prevState => {
            const { participants } = prevState

            participants[userId] = false

            return { participants }
        })
    }

    setParticipantAmount = (userId, amount) => {
        this.setState(prevState => {
            const { amounts } = prevState

            amounts[userId] = parseFloat(amount)

            return { amounts }
        })
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

    goBack = e => {
        e.preventDefault()
        this.props.history.push('/home')
    }

    splitSpends = () => {
        const group = this.state.groupId
        debugger
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
                        {this.state.spends.length ? <h2>Group Spends By User</h2> : null}
                        {this.state.spends.map(spend =>
                            spend.fractions.map(fraction =>
                                fraction.amount > 0 && <div>
                                    <label className='groupInput'>{fraction.userId.name}</label>
                                    <label className='groupInput'>{fraction.amount}</label>
                                </div>
                            )
                        )
                        }

                    </form>
                    <section>
                        <h2>User's group</h2>
                        <input className="groupInput" type="text" onChange={this.catchAmount} placeholder="new payment amount" />
                        {this.state.users.map(user => <div className='banner'>
                            <label className='groupInput'>{user.name}</label>
                            <input onClick={e => { e.target.checked ? this.selectParticipant(user._id) : this.unselectParticipan(user._id) }} className='my-checkbox' type="checkbox" />
                            <input onClick={e => { this.selectPayer(user._id) }} className='my-checkbox' type="radio" name="payer" />
                            <input type="number" onChange={e => this.setParticipantAmount(user._id, e.target.value)} />
                        </div>
                        )}
                        <button onClick={this.addSpend}>Add a Spend</button>
                    </section>
                    <form onSubmit={this.addUserToGroup}>
                        <h2>Add a User</h2>
                        <input className="inner flex flex-3" type="text" onChange={this.handlerAddUser} placeholder="user email" />
                        <button type='submit'>Add User to Group</button>
                    </form>
                    <section>
                        {this.state.balance.map(res => <div>
                            <label className='groupInput'>{res}</label>
                        </div>)}
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