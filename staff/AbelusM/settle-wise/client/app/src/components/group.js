import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logic from '../logic'
import '../styles/assets/css/main.css'
import surfgroup from '../styles/images/surfgroup.jpg'
import GroupsList from './GroupsList'
import Spend from './Spend'

class Group extends Component {
    state = {
        groups: [],
        email: '',
        groupId: '',
        spends: '',
        amount: 0,
        payerId: '',
        fractions: []
    }

    componentDidMount() {
        logic.listSpends(this.state.groupId)
            .then((spends) => this.setState({ spends }))
    }

    addUserToGroup = e => {
        e.preventDefault()
        const email = this.state.email
        const groupId = this.state.groupId

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

    catchUserName = e => {
        e.preventDefault()
        this.setState({
            email: e.target.value
        })
    }

    catchUserName = e => {
        e.preventDefault()
        this.setState({
            email: e.target.value
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
                        <h1>{this.state.groups.name}</h1>

                    </header>
                    <form>
                        <input className="inner flex flex-3" type="text" onChange={this.catchUserName} placeholder="user email" />
                        <button value={this.email} onClick={this.addUserToGroup}>Add User to Group</button>
                    </form>
                    <Spend/>
                </div>
            </section>
        </main>
    }

}

export default Group