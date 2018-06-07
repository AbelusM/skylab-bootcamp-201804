import React, { Component } from 'react'
import logic from '../logic'

class Register extends Component {
    state = { name: '', surname:'', email:'', password: '' }

    updateName = e => {
        this.setState({ name: e.target.value })
    }

    updateSurname = e => {
        this.setState({ surname: e.target.value })
    }
    
    updateEmail = e => {
        this.setState({ email: e.target.value })
    }

    updatePassword = e => {
        this.setState({ password: e.target.value })
    }

    register = e => {
        e.preventDefault()

        const { name, surname, email, password } = this.state

        this.setState({ name: '', surname:'', email:'', password: '' })

        logic.register(name, surname, email, password)
            .then(() => this.props.onRegister())
            .catch(({ message }) => this.props.onRegisterError(message))
    }

    render() {
        return <main>
            <h1>Register</h1>
            <form onSubmit={this.register}>
                <input type="text" placeholder="name" onChange={this.updateName} />
                <input type="text"  placeholder="surname" onChange={this.updateSurname} />
                <input type="text"  placeholder="email" onChange={this.updateEmail} />
                <input type="password"  placeholder="password" onChange={this.updatePassword} />
                <button type="submit">Register</button>
            </form>
        </main>
    }
}

export default Register