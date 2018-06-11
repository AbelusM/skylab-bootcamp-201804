import React, { Component } from 'react'
import logic from '../logic'
import '../styles/assets/css/main.css'
import surfgroup from '../styles/images/surfgroup.jpg'
import GroupsList from './GroupsList'

class Home extends Component {
	state = {
		groups: [],
		groupName: ''
	}

	createGroup = () => {
		let name = this.state.groupName

		logic.createGroup(name)
			.then(() => {
				this.listGroups()
			})
			.then(() => console.log('created group'))
			.then(()=> this.setState.groupName = '')
	}

	listGroups = () => {
		logic.listGroups()
			.then(groups => this.setState({ groups }))
	}

	catchGroupName = e => {
		this.setState({
			groupName: e.target.value
		})
	}

	submit = (e) => {
		e.preventDefault()
		// this.props.history.push(`/groups`)
	}

	render() {
		return <main id="banner">
			<h1>Home</h1>
			<section id="main" className="wrapper">
				<div className="inner">
					<header className="align-center">
						<h1>Groups Page</h1>
						<p>These are your Groups</p>
					</header>
					<form>
						<input type="text" onChange={this.catchGroupName} placeholder="group name" />
						<button value={this.groupName} onClick={this.createGroup}>Create Group</button>
					</form>
					<GroupsList groups={this.state.groups} />
					{/* <button onClick={this.listGroups()}>List your Groups</button>
					<div className="image fit">
						<img src={surfgroup} alt="" />
					</div>
					<div className="image fit">
						<input type="text" name="groupname" />
						<button onClick={this.createGroup}>Create Group</button> 
					</div>*/}
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