import React, { Component } from 'react'
import logic from '../logic'

class Login extends Component {
    state = { email: '', password: '' }

    updateEmail = e => {
        this.setState({ email: e.target.value })
    }

    updatePassword = e => {
        this.setState({ password: e.target.value })
    }

    login = e => {
        e.preventDefault()

        logic.login(this.state.email, this.state.password)
            .then(() => this.props.onLogin())
            .catch(({ message }) => this.props.onLoginError(message))
    }

    render() {
        return <main>
            <h1>Login</h1>
            <form onSubmit={this.login}>
                <input type="text" placeholder="email" onChange={this.updateEmail} />
                <input type="password" placeholder="password" onChange={this.updatePassword} />
                <button type="submit">Login</button>
            </form>
        </main>
    }
}

export default Login