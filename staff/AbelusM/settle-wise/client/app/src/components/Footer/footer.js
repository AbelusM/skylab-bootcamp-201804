import React from 'react';
import { withRouter } from 'react-router-dom'


function Footer(props) {

    return (
        <div className="footer">
            <footer id="footer">
                <div className="inner">
                    <h2>Get In Touch</h2>
                    <ul className="actions">
                        <li><span className="icon fa-phone"></span> <a href="">(+34) 666-666-666</a></li>
                        <li><span className="icon fa-envelope"></span> <a href="">ahfortis@hotmail.com</a></li>
                        <li><span className="icon fa-map-marker"></span> C/ Roc Boronat, Nº35, Barcelona</li>
                    </ul>
                </div>
                <div className="copyright">
                    &copy; Copyright 2018 Abel Hernando Fortis | All Rights Reserved.
				</div>
            </footer>

        </div>
    )
}

export default withRouter(Footer)