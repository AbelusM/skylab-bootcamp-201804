import React, { Component } from 'react'
import { Register, Login, Landing, Home, Group } from './components'
import { Link, Route, withRouter, Redirect } from 'react-router-dom'
import './styles/assets/css/main.css';
import logic from './logic'
import Menu from './components/menu.js'
import Header from './components/header.js'
import One from './components/one.js'
import Footer from './components/footer.js'

class App extends Component {
  state = { registered: false }

    // componentDidMount() {
    //   if (logic.loggedIn) this.props.history.push('/home')
    // }

  onRegister = () => {
    console.log('register')

    this.setState({ registered: true })
    this.props.history.push('/login')
    
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
    this.setState({
      registered: false
    })
    this.props.history.push('/')
  }

  render() {
    return (
      <div className="App">
        <Menu />
        <Header />
        <Route exact path="/" render={() => <Landing />} />
        <Route exact path="/groups/:groupId" render={routeProps => <Group {...routeProps} />} />
        <Route path="/one" render={() => <One />} />
        <Route exact path="/menu" render={() => <Home onLogout={this.onLogout} />} />
        {
          <Route exact path="/register" render={() => {
            return this.state.registered ?
              <Link to="/login"><Login /></Link>
              :
              <Register onRegister={this.onRegister} onRegisterError={this.onRegisterError} />
          }} />
        }
        <Route exact path="/login" render={() =>

          !logic.loggedIn ?
            <Login onLogin={this.onLogin} onLoginError={this.onLoginError} /> : <Redirect to='/home' />} />
        {logic.loggedIn && <Route exact path="/home" render={() => <Home onLogout={this.onLogout} />} />}
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);
