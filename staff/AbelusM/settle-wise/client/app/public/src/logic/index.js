'use strict'

const api = require('api')

api.url = 'http://localhost:5000/api'

const logic = {
    userId: 'NO-ID',

    registerUser(name, surname, email, password) {
        return api.registerUser(name, surname, email, password)
    },

    loginUser(email, password) {
        return api.authenticateUser(email, password)
            .then(id => {
                this.userId = id

                return true
            })
    }
}

module.exports = logic
//export default logic