import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logic from '../../logic'
import GroupsList from './groupslist'
import { ParseOptions } from 'querystring';
import img from '../../styles/images/banner.jpg'
import { Collapse, Button, CardBody, Card, Input, Form, FormGroup, Label, Alert } from 'reactstrap';
import './style.css'

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
        spendName: '',
        collapse1: false,
        collapse2: false

    }

    componentWillReceiveProps() {
        this.listUsers()
        this.listSpends()
    }

    toggle = (id) => {
        if (id === 1) {
            this.setState({
                collapse1: !this.state.collapse1,
                collapse2: false
            });

        }
        else
            this.setState({ collapse2: !this.state.collapse2, collapse1: false });

    }

    addUserToGroup = e => {
        e.preventDefault()

        const { groupId, email, users } = this.state

        logic.addUserToGroup(groupId, email)
            .then(() => console.log('user added to group'))
            .then(addUser => {
                for (let n = 0; n < users.length; n++) {
                    if (addUser._id === users[n]._id) throw Error('user already on group')
                }
            }).catch(err => console.error)
            .then(newUser => {
                this.setState({ newUser })
            })
    }

    handlerAddUser = e => {
        e.preventDefault()

        this.setState({
            email: e.target.value
        })
    }

    addSpend = e => {
        e.preventDefault()

        const { groupId, payerId, spendName, amount, participants, amounts } = this.state

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

    changeColor = (i) => {
        const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger',]

        if (i > 5 || typeof i === undefined) i = 0;

        return colors[i].toString()
    }

    render() {
        return <main id="banner">
            {/* <img src={img} alt='background' /> */}
            <Card className='group-card'>
                <CardBody>
                    <Alert>
                        {this.state.users.length ? <h2>User Members</h2> : null}
                        {this.state.users.map((user, key) => <Button key={key} color={this.changeColor(key)}><option style={{ marginBottom: '1rem' }} >{user.name}</option></Button>)}
                    </Alert>
                    <section id="main" className="">
                        <div className="form-user">
                            {this.state.spends.length ? <h2>Group Spends By User</h2> : null}
                            <div>
                                <Button color="primary" onClick={() => { this.toggle(1) }} style={{ marginBottom: '1rem' }}>Add a User</Button>
                                <Button color="primary" onClick={() => { this.toggle(2) }} style={{ marginBottom: '1rem' }}>Add a Spend</Button>
                                <Collapse isOpen={this.state.collapse1}>
                                    <h5>Add a user to Group</h5>
                                    <Card className='group-card'>
                                        <CardBody>
                                            <Form onSubmit={this.addUserToGroup} >
                                                <FormGroup>
                                                    <Input className="inner flex flex-3" type="text" onChange={this.handlerAddUser} placeholder="user email" />
                                                </FormGroup>
                                                <Button >Confirm User </Button>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                                <Collapse isOpen={this.state.collapse2}>
                                    <h5>Add a spend to the Group</h5>
                                    <Card className='group-card'>
                                        <CardBody>
                                            <Form >
                                                <FormGroup>
                                                    <Input className="" type="text" onChange={this.catchSpendName} placeholder="new payment name" />
                                                    <Input className="" type="number" onChange={this.catchAmount} placeholder="new payment total amount" />
                                                    <Label for="exampleSelect">Select the Payer</Label>
                                                    <Input type="select" name="payer">
                                                        {this.state.users.map((user, key) => <option key={key} onSelectCapture={e => { this.selectPayer(user._id) }}>{user.name}</option>)}
                                                    </Input>
                                                    {this.state.users.map((user, key) => <div key={key} className='banner'>
                                                        <label className=''>{user.name}</label>
                                                        <Input onClick={e => { e.target.checked ? this.selectParticipant(user._id) : this.unselectParticipant(user._id) }} className='my-checkbox' type="checkbox" />
                                                        <Input type="number" onChange={e => this.setParticipantAmount(user._id, e.target.value)} placeholder='amount payed by the user' />
                                                    </div>
                                                    )}
                                                </FormGroup>
                                                <Button onSubmit={this.addSpend}>Confirm Spend </Button>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                            </div>
                            <form>
                                {this.state.spends.length ? <h2>Group Spends By User</h2> : null}
                                <section><h4>{this.state.spendName}</h4> {this.state.spends.map((spend, key) =>
                                    <div key={key} className='random'><h4>Total Spend: {spend.amount}</h4> {spend.fractions.map((fraction, key) =>
                                        fraction.amount > 0 && <div key={key} className="">
                                            <h5 >Participant:</h5>
                                            <label >{fraction.userId.name}</label>
                                            <h5 >Amount: </h5>
                                            <label >{fraction.amount}</label>
                                        </div>
                                    )}</div>
                                )
                                }
                                </section>
                            </form>
                            {/* <section className='section-group'>
                        <h2>User's group</h2>
                        <input className="groupInput" type="number" onChange={this.catchAmount} placeholder="new payment amount" />
                        <input className="groupInput" type="text" onChange={this.catchSpendName} placeholder="new payment name" />
                        {this.state.users.map((user, key) => <div key={key} className='banner'>
                            <label className='groupInput'>{user.name}</label>
                            <input onClick={e => { e.target.checked ? this.selectParticipant(user._id) : this.unselectParticipan(user._id) }} className='my-checkbox' type="checkbox" />
                            <input onClick={e => { this.selectPayer(user._id) }} className='my-checkbox' type="radio" name="payer" />
                            <input type="number" onChange={e => this.setParticipantAmount(user._id, e.target.value)} />
                        </div>
                        )}
                        <button onClick={this.addSpend}>Add a Spend</button>
                    </section> */}
                        </div>
                    </section>
                </CardBody>
            </Card>
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
                <Button color='info' onClick={this.splitSpends}>Split Spends</Button>
            </section>
            <section>
                <Button color='warning' onClick={this.goBack}>Go to Groups</Button>
            </section>
        </main>
    }

}

export default Group