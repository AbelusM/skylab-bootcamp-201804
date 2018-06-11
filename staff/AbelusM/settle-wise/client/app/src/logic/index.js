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
                this.userId = id.toString()

                return true
            })
    },

    createGroup(name) {
        return api.createGroup(this.userId, name)
            .then(() => true)
    },

    listGroups() {
        return api.listGroupsByUser(this.userId)
            .then(data => data)
    },

    get loggedIn() {
        return this.userId !== 'NO-ID' && this.userId !== null && this.userId !== undefined
    },

    /**
 * Logs a user out
 * 
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * 
 * @returns {boolean} - Confirms log-out 
 */
    logout() {
        this.storage.clear()

        return true
    }

}

module.exports = logic
//export default logic