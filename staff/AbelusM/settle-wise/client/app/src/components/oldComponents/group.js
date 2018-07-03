import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logic from '../logic'
// import '../styles/assets/css/main.css'
import surfgroup from '../styles/images/surfgroup.jpg'
import GroupsList from './groupslist'
import { ParseOptions } from 'querystring';
import { Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle, Button, Popover, PopoverHeader, PopoverBody  } from 'reactstrap';

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
        newUser: '',
        spendName: ''
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

        const { spendName, groupId, payerId, amount, participants, amounts } = this.state

        const fractions = []

        var userIds = Object.keys(participants)

        userIds.forEach(userId => {
            fractions.push({ "user": userId, "amount": amounts[userId] })
        })

        logic.addSpend(groupId, amount, spendName, payerId, fractions)
            .then(() => console.log('added a spend to the group'))
            .catch(console.error)
    }

    catchAmount = e => {
        e.preventDefault()
        const amount = parseInt(e.target.value)
        this.setState({ amount })
    }

    catchSpendName = e => {
        e.preventDefault()
        const spendName = e.target.value
        this.setState({ spendName })
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
                console.log(spends)

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

        logic.splitSpends(group)
            .then(balance => {
                this.setState({ balance })
            })
    }

    render() {
        return <main id="banner">
            <section id="main" className="wrapper">
                <div className="inner">
                {this.state.spends.length ? <h2>Group Spends By User</h2> : null} <div>
                        <Card className='random'>
                            <CardBody>
                                <CardTitle>GroupName</CardTitle>
                                <CardSubtitle>Card subtitle</CardSubtitle>
                            </CardBody>
                            <CardBody>
                                <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                                <CardLink href="#">Card Link
                                </CardLink>
                                <CardLink href="#">Another Link</CardLink>
                            </CardBody>
                        </Card>
                    </div>  
                    {/* <form>
                        {this.state.spends.length ? <h2>Group Spends By User</h2> : null}
                        <section><h4>{this.state.spendName}</h4> {this.state.spends.map(spend =>
                            <div className='random'><h4>Total Spend: {spend.amount}</h4> {spend.fractions.map(fraction =>
                                fraction.amount > 0 && <div className="">
                                    <h5 >Participant:</h5>
                                    <label >{fraction.userId.name}</label>
                                    <h5 >Amount: </h5>
                                    <label >{fraction.amount}</label>
                                </div>
                            )}</div>
                        )
                        }
                        </section>

                    </form> */}
                    <section className='section-group'>
                        <h2>User's group</h2>
                        <input className="groupInput" type="number" onChange={this.catchAmount} placeholder="new payment amount" />
                        <input className="groupInput" type="text" onChange={this.catchSpendName} placeholder="new payment name" />
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
                        {this.state.balance.length ? <h2>Operation Balance - Creditor to Debtor</h2> : null}
                        {this.state.balance.map(res => <div className='random'>
                            <h4 className=''>User:</h4>
                            <label className=''>{res.debtorId}</label>
                            <h4 className=''>Debts To:</h4>
                            <label className=''>{res.creditorId}</label>
                            <h4 className=''>Amount:</h4>
                            <h3 className=''>{res.amount}</h3>
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