import React, { Component } from 'react'
import { Register, Login, Landing, Home } from './components'
import { Link, Route, withRouter } from 'react-router-dom'
import './styles/assets/css/main.css';
import logic from './logic'
import Menu from './components/menu.js'
import Header from './components/header.js'
import Footer from './components/footer.js'


class App extends Component {
  state = { registered: false }

  componentDidMount() {
    if (logic.loggedIn) this.props.history.push('/home')
  }

  onRegister = () => {
    console.log('register')

    this.setState({ registered: true })
  }

  onRegisterError(message) {
    console.error('register error', message)
  }

  onLogin = () => {
    console.log('login')

    this.props.history.push('/home')
  }

  onLoginError(message) {
    console.error('login error', message)
  }

  onLogout = () => {
    this.props.history.push('/')
  }

  render() {
    return (
      <div className="App">
        <Menu />
        <Header />
        <Route exact path="/" render={() => <Landing />} />
        {
          <Route exact path="/register" render={() => {
            return this.state.registered ?
              <Link to="/login"><Login /></Link>
              :
              <Register onRegister={this.onRegister} onRegisterError={this.onRegisterError} />
          }} />
        }
        <Route exact path="/login" render={() => !logic.loggedIn && <Login onLogin={this.onLogin} onLoginError={this.onLoginError} />} />
        {logic.loggedIn && <Route path="/home" render={() => <Home onLogout={this.onLogout} />} />}
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);
