import React from 'react';
import { withRouter } from 'react-router-dom'
// import '../styles/assets/css/main.css';


function Menu(props) {
   
    return (
        <div className="menu">
            <nav id="menu">
                <ul className="links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="groups.html">Groups</a></li>
                    <li><a href="elements.html">Elements</a></li>
                </ul>
                <ul className="actions vertical">
                    <li><a href="#login" className="button fit">Login</a></li>
                </ul>
            </nav>
        </div>
    )
}

export default withRouter(Menu)