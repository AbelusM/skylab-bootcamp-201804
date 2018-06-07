import React from 'react'
import { Link } from 'react-router-dom'

function Landing(props) {
    return <main>
        <h1>Landing</h1>
        <Link to="/register">Register</Link>
        &nbsp;|&nbsp;
            <Link to="/login">Login</Link>
    </main>
}

export default Landing