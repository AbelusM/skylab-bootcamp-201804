import React from 'react';
import { withRouter } from 'react-router-dom'
import '../styles/assets/css/main.css';


function Banner(props) {

    return (
        <div className="banner">
            <section id="banner">
                <div className="content">
                    <h1>SettleWise</h1>
                    <p><strong>Is an application that allows you to create groups and divide your group spendings just to control all the payments your group does</strong></p>
                    <ul className="actions">
                        <li><a href="#one" className="button scrolly">Get Started</a></li>
                    </ul>
                </div>
            </section>
        </div>
    )
}

export default withRouter(Banner)