import React from 'react';
import { withRouter } from 'react-router-dom'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import NavLogin from './navlogin'
import '../styles/assets/css/main.css'

class MyNavbar extends React.Component {
    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
    render() {
        return (
            <div>
                <Navbar className='header' id= 'header' color="faded" light>
                    <NavbarBrand href="/" className="menu">Settle Wise</NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="menu" />
                    <Collapse isOpen={!this.state.collapsed} className='right' navbar>
                        <Nav navbar className='links'>
                            <NavItem>
                                <NavLink href="#/home">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#/register">Register</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLogin className="button fit" />
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default MyNavbar