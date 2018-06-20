import React, { Component } from 'react'
import logic from '../logic'
import '../styles/assets/css/main.css'
import surfgroup from '../styles/images/surfgroup.jpg'
import GroupsList from './GroupsList'
import Group from './group'

class Home extends Component {
	state = {
		groups: [],
		groupName: ''
	}

	componentDidMount() {
		logic.listGroups()
			.then((groups) => this.setState({ groups }))
	}

	createGroup = e => {
		e.preventDefault()
		const name = this.state.groupName

		logic.createGroup(name)
			.then(() => {
				return logic.listGroups()
			})
			.then(lists => {
				this.setState({
					groups: lists
				})
				 console.log('created group')
			})

	}
	
	catchGroupName = e => {
		// e.preventDefault()
		this.setState({
			groupName: e.target.value
		})
	}

	showList() {
		return this.state.groups.map(group => <div>
			<button>{group.name}</button>
		</div>)
	}

	submit = (e) => {
		e.preventDefault()
		this.props.history.push(`/groups`)
	}

	render() {
		return <main id="banner">
			<section id="main" className="wrapper">
				<div className="inner">
					<header className="align-center">
						<h1>Groups Page</h1>
						<h2>Add a new Group</h2>
					</header>
					<form>
						<input className="inner flex flex-3" type="text" onChange={this.catchGroupName} placeholder="group name" autoComplete="off" />
						<button value={this.groupName} onClick={this.createGroup}>Create Group</button>
					</form>
						<h2>These are your Groups</h2>
					<GroupsList groups={this.state.groups} />
				</div>
			</section>
			<button onClick={() => {
				logic.logout()

				this.props.onLogout()
			}}>Logout</button>
		</main>
	}
}

export default Home