const api = require('api')

api.url = 'http://localhost:5000/api'
// api.url = 'https://fast-citadel-66514.herokuapp.com/api'

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

    addSpend(groupId, amount, payerId, fractions) {
        return api.addSpend(this.userId, groupId, amount, payerId, fractions)
            .then(spend => {
                console.log(spend)
                return spend
            })
    },
    
    listUsers(group) {
        return api.listUsers(this.userId, group)
            .then(users => {
                console.log(users)
                return users
            })
    },

    listSpends(group) {
        return api.listSpends(this.userId, group)
            .then(spends => {
                console.log(spends)
                return spends
            })
    },

    splitSpends(group) {
        return api.splitSpends(this.userId, group)
            .then(balance => {
                console.log(balance)
                return balance
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