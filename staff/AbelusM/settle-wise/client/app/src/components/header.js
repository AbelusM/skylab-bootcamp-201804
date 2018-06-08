import React from 'react';
import { withRouter } from 'react-router-dom'
import '../styles/assets/css/main.css';


function Header(props) {

    return (
        <div className="header">
            <header id="header">
                <nav className="left">
                    <a href="#menu"><span>Menu</span></a>
                </nav>
                <a href="index.html" className="logo">SettleWise</a>
                <nav className="right">
                    <a href="#login" className="button alt">Log in</a>
                    <a href="#register" className="button alt">Register</a>
                </nav>
            </header>
        </div>
    )
}

export default withRouter(Header)