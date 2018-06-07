import React from 'react'
import logic from '../logic'

function Home(props) {
    return <main>
        <h1>Home</h1>
        <button onClick={() => {
            logic.logout()

            props.onLogout()
        }}>Logout</button>
    </main>
}

export default Home