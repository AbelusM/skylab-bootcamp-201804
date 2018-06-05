'use strict'

const mongoose = require('mongoose')
const express = require('express')
const router = require('./src/routes/index')


mongoose.connect('mongodb://localhost/sweet-home-test')
    .then(() => {
        const port = process.argv[2] || 3000

        const app = express()

        app.use('/api', router)

        app.listen(port, () => console.log(`server running on port ${port}`))

        process.on('SIGINT', () => {
            console.log('\nstopping server')

            mongoose.connection.close(() => {
                console.log('db connection closed')

                process.exit()
            })
        })
    })
    .catch(console.error)