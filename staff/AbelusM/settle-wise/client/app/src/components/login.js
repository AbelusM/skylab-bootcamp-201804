import React, { Component } from 'react'
import logic from '../logic'
import api from 'api'
import '../styles/assets/css/main.css'
import '../styles/assets/css/login.css'
import swal from 'sweetalert2'



class Login extends Component {
    state = { email: '', password: '' }

    componentDidMount() {
        if (sessionStorage.getItem('userId')) {
            logic.listGroups()
                .catch(() => {
                    swal({
                        type: 'error',
                        title: 'Hey!',
                        html: '<p>You are already logged!</p>',
                        animation: true,
                        customClass: 'animated flipInX'
                    })
                })
                .then(this.props.history.push(`/home`))
        }
    }

    updateEmail = e => {
        this.setState({ email: e.target.value })
    }

    updatePassword = e => {
        this.setState({ password: e.target.value })
    }

    login = e => {
        e.preventDefault()

        logic.loginUser(this.state.email, this.state.password)
            .then(res => {
                if (res) {
                    sessionStorage.setItem('userId', logic.userId)
                    sessionStorage.setItem('token', api.token)

                    this.props.onLogin()
                }
            })
            .catch(error => {
                swal({
                    type: 'error',
                    title: 'Hey!',
                    html: "<p>Username or password doesn't exist</p>",
                    animation: true,
                    confirmButtonColor: '#00000f',
                    customClass: 'animated flipInX'
                })

            })
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