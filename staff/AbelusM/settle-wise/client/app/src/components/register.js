import React, { Component } from 'react'
import logic from '../logic'
import '../styles/assets/css/main.css'
import '../styles/assets/css/register.css'

class Register extends Component {
    state = { name: '', surname: '', email: '', password: '' }

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

        this.setState({ name: '', surname: '', email: '', password: '' })

        logic.registerUser(name, surname, email, password)
            .then(() => this.props.onRegister())
            .catch(({ message }) => this.props.onRegisterError(message))
    }

    render() {
        return <main id="banner" className="content">
            <div>
                <h1>TELL US EVERYTHING!</h1>
                <form onSubmit={this.register}>
                    <label for="name">Name:</label>
                    <input type="text" placeholder="name" onChange={this.updateName} />
                    <label for="name">Surname:</label>
                    <input type="text" placeholder="surname" onChange={this.updateSurname} />
                    <label for="email">Email:</label>
                    <input type="text" placeholder="email" onChange={this.updateEmail} />
                    <label for="password">Password:</label>
                    <input type="password" placeholder="password" onChange={this.updatePassword} />
                    <button className="register-button" type="submit">Register</button>
                </form>
            </div>
        </main>
    }
}

export default Register