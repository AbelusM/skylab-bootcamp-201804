const api = require('api')

api.url = 'http://localhost:5000/api'

const logic = {
    userId: 'NO-ID',
    groupId: 'NO-ID',

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
            .then(groups => {
                console.log(groups)
                return groups
            })
    },

    addUserToGroup(groupId, email) {
        return api.addUserToGroup(this.userId, groupId, email)
            .then(user => {
                console.log(user)
                return user
            })
    },

    addSpend(amount, payerId, fractions) {
        return api.addSpend(this.userId, this.groupId, amount, payerId, fractions)
            .then(spend => {
                console.log(spend)
                return spend
            })
    },

    listSpends(groupId) {
        return api.listSpends(this.groupId)
            .then(spends => {
                console.log(spends)
                return spends
            })
    },


    get loggedIn() {
        if (this.userId !== 'NO-ID' && this.userId !== null && this.userId !== undefined) return true
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
        sessionStorage.clear()

        return true
    }

}

module.exports = logic