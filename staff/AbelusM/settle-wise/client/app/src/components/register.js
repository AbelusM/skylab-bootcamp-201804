import React, { Component } from 'react'
import logic from '../logic'
import '../styles/assets/css/main.css'
import '../styles/assets/css/register.css'
import swal from 'sweetalert2'


class Register extends Component {
    state = { name: '', surname: '', email: '', password: '' }

    componentDidMount() {
        if (sessionStorage.getItem('userId')) {
            logic.listGroups()
                .catch(() => {
                    swal({
                        type: 'error',
                        title: 'Hey!',
                        html: '<p>You are already registered!</p>',
                        animation: true,
                        customClass: 'animated flipInX'
                    })
                })
                .then(this.props.history.push(`/login`))
        }
    }

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

        logic.registerUser(name, surname, email, password)
            .then(() => this.props.onRegister())
            .then(() => swal({
                type: 'success',
                title: 'Congrats!',
                html: '<p>Registered Successful!</p>',
                animation: true,
                customClass: 'animated flipInX'
            }))
            .catch(({ message }) => {
                swal({
                    type: 'error',
                    title: 'Oops... ',
                    html: '<p>Something went wrong!</p>',
                    animation: true,
                    customClass: 'animated flipInX'
                })
                this.props.onRegisterError(message)
            })

        this.setState({ name: '', surname: '', email: '', password: '' })
    }

    render() {
        return <main id="banner" className="content">
            <div>
                <h1>TELL US EVERYTHING!</h1>
                <form className='register-form' onSubmit={this.register}>
                    <label for="name">Name:</label>
                    <input className='register-inputs' type="text" placeholder="name" onChange={this.updateName} />
                    <label for="name">Surname:</label>
                    <input className='register-inputs' type="text" placeholder="surname" onChange={this.updateSurname} />
                    <label for="email">Email:</label>
                    <input className='register-inputs' type="text" placeholder="email" onChange={this.updateEmail} />
                    <label for="password">Password:</label>
                    <input className='register-inputs' type="password" placeholder="password" onChange={this.updatePassword} />
                    <button className="register-button" type="submit">Register</button>
                </form>
            </div>
        </main>
    }
}

export default Register