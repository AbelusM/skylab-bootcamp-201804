'use strict'

require('dotenv').config()
const { mongoose } = require('data')
const express = require('express')
const router = require('./routes')
const { env: { DB_URL } } = process

mongoose.connect(DB_URL)
    .then(() => {
        const port = process.env.PORT || 3000

        const app = express()

        app.use('/api', router)

        app.use('cors')

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