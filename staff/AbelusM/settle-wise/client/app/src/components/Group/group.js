import React, { Component } from 'react'
import logic from '../../logic'
import swal from 'sweetalert2'
import img from '../../styles/images/back.jpg'
import { Collapse, Button, CardBody, Card, Input, Form, FormGroup, Label, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './group-style.css'

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
        collapse2: false,
        modal: false
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

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    addUserToGroup = e => {
        const { groupId, email, users } = this.state

        logic.addUserToGroup(groupId, email)
            .catch(() => {
                swal({
                    type: 'error',
                    title: 'Hey!',
                    html: '<p>This user is already belongs to the Group!!</p>',
                    animation: true,
                    customClass: 'animated flipInX'
                })
            })
            .then(() => console.log('user added to group'))
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
            <div>
                <img src={img} alt='background' />
                <Card className='groups-card'>
                    <CardBody>
                        <Alert className='center'>
                            {this.state.users.length ? <h2>User Members</h2> : null}
                            {this.state.users.map((user, key) => <Button className='users' key={key} color={this.changeColor(key)}><option>{user.name}</option></Button>)}
                        </Alert>
                        <section id="main" className="">
                            <div className="">
                                {this.state.spends.length ? <h2>Group Spends By User</h2> : null}
                                <div>
                                    <Button className='form-button' onClick={() => { this.toggle(1) }} style={{ marginBottom: '1rem' }}>Add a User</Button>
                                    <Button className='form-button' onClick={() => { this.toggle(2) }} style={{ marginBottom: '1rem' }}>Add a Spend</Button>
                                    <Collapse isOpen={this.state.collapse1}>
                                        <h4>Add a user to Group</h4>
                                        <Card className=''>
                                            <CardBody className='mb-5 form-user2'>
                                                <Form onSubmit={this.addUserToGroup} >
                                                    <FormGroup>
                                                        <Input className="inner flex flex-3" type="text" onChange={this.handlerAddUser} placeholder="user email" />
                                                    </FormGroup>
                                                    <Button className='form-button'>Confirm User </Button>
                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                    <Collapse isOpen={this.state.collapse2}>
                                        <h4>Add a spend to the Group</h4>
                                        <Card className=''>
                                            <CardBody className='mb-5 form-user2'>
                                                <Form onSubmit={this.addSpend}>
                                                    <FormGroup>
                                                        <Input className="" type="text" onChange={this.catchSpendName} placeholder="new payment name" />
                                                        <Input className="" type="number" onChange={this.catchAmount} placeholder="new payment total amount" />
                                                        <Label for="exampleSelect">Select the Payer</Label>
                                                        <Input type="select" name="payer">
                                                            {this.state.users.map((user, key) => <option key={key} onChange={e => { this.selectPayer(user._id) }} value={user._id}>{user.name}</option>)}
                                                        </Input>
                                                        {this.state.users.map((user, key) => <div key={key} className='banner'>
                                                            <Label className=''>{user.name}</Label>
                                                            <Input onClick={e => { e.target.checked ? this.selectParticipant(user._id) : this.unselectParticipant(user._id) }} className='my-checkbox' type="checkbox" />
                                                            <Input type="number" onChange={e => this.setParticipantAmount(user._id, e.target.value)} placeholder='amount payed by the user' />
                                                        </div>
                                                        )}
                                                    </FormGroup>
                                                    <Button className='form-button'>Confirm Spend </Button>
                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </div>

                                {/*LIST SPENDS TO A GROUP*/}
                                <form>
                                    {this.state.spends.length ? <h2>Group Spends By User</h2> : null}
                                    <section>{this.state.spends.map((spend, key) =>
                                        <div key={key} className='random'><h4>{spend.name}</h4><h4>
                                            Total Spend: {spend.amount}</h4> {spend.fractions.map((fraction, key) =>
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
                                {/*ADD SPENDS TO A GROUP*/}
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


                        {/*SPLIT SPENDS OF THE GROUP*/}
                        <Button color="danger" className='special-button' onClick={this.toggleModal}>Split Spends</Button>
                        <Modal isOpen={this.state.modal} toggleModal={this.toggleModal} className={this.props.className}>
                            <ModalHeader toggleModal={this.toggleModal}>Settle Wise</ModalHeader>
                            <ModalBody>
                                {this.state.balance.length ? <h2>Operation Balance - Creditor to Debtor</h2> : <h3>There are no Spends to Split</h3>}
                                {this.state.balance.map(res => <div className='random'>
                                    <Card className='group-card'>
                                        <CardBody>
                                            <h4 className=''>User:</h4>
                                            <label className=''>{res.debtorId}</label>
                                            <h4 className=''>Debts To:</h4>
                                            <label className=''>{res.creditorId}</label>
                                            <h4 className=''>Amount:</h4>
                                            <h3 className=''>{res.amount}</h3>
                                        </CardBody>
                                    </Card>
                                </div>)}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.toggleModal}>Great!</Button>{' '}
                            </ModalFooter>
                        </Modal>
                        <section>
                            <Button color='warning' className='special-button'onClick={this.goBack}>Go to Groups</Button>
                        </section>
                    </CardBody>
                </Card>
                {/*SPLIT SPENDS OF THE GROUP*/}
                {/* <section>
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
            </section> */}
            </div>
        </main>
    }

}

export default Group