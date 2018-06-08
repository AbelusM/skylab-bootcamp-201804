import React, { Component } from 'react'
import logic from '../logic'
import '../styles/assets/css/main.css'
import '../styles/assets/css/login.css'


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

        logic.loginUser(this.state.email, this.state.password)
            .then(() => this.props.onLogin())
            .catch(({ message }) => this.props.onLoginError(message))
    }

    render() {
        return <main id="banner" className="login-content">
        <div className="content">
            <h1>Login</h1>
            <form onSubmit={this.login}>
            <label for="username">Username:</label>
                <input type="text" placeholder="email" onChange={this.updateEmail} />
                <label for="password">Password:</label>
                <input type="password" placeholder="password" onChange={this.updatePassword} />
                <button type="submit">Login</button>
            </form>
            </div>
        </main>
    }
}

export default Login