import React from 'react';
import { withRouter } from 'react-router-dom'
import '../styles/assets/css/main.css';

function Two(props) {

    return (
        <div className="two">
            <section id="two" className="wrapper style1 special">
                <div className="inner">
                    <h2>Valorations</h2>
                    <figure>
                        <blockquote>
                            "I never fight with roommates over bills because of this genius expense-splitting app"
					    </blockquote>
                        <footer>
                            <cite className="author">Amalia Rabinson</cite>
                            <cite className="company">Bussiness Outsider</cite>
                        </footer>
                    </figure>
                </div>
            </section>

        </div>
    )
}

export default withRouter(Two)