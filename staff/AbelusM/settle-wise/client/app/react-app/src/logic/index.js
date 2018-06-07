//import usersApi from '../utils/users-api-1.0.0' // babel
//import Xtorage from '../utils/xtorage-1.0.1' // babel
import api from 'api'

if (typeof require === 'function') {
    // var api = require('../../../../../client/api/src')    
    // var usersApi = require('../utils/users-api-1.0.0')
    var Xtorage = require('../utils/xtorage-1.1.0')
}

/**
 * Settle-Wise logic
 */
const logic = {
    /**
     * Initializes logic's storage
     * 
     * @param {Xtorage} storage - The storage to use (session or local)
     */
    init(storage = Xtorage.session) {
        if (!(storage instanceof Xtorage)) throw Error('storage not an instance of Xtorage')

        this.storage = storage

        // use session storage for token
        api.token = token => {
            if (token) {
                this.storage.set('token', token)

                return
            }

            return this.storage.get('token')
        }
    },

    /**
     * @async
     * 
     * @param {string} name 
     * @param {string} surname 
     * @param {string} email 
     * @param {string} password 
     * 
     * @returns {Promise<boolean>}
     */
    register(name, surname, email, password) {
        return api.registerUser(name, surname, email, password)
            .then(() => true)
    },

    /**
     * Logs a user in
     * 
     * @async
     * 
     * @param {string} email - The user's email
     * @param {string} password - The user's password
     * 
     * @returns {Promise<boolean>} - Confirms log-in 
     */
    login(email, password) {
        return api.authenticateUser(email, password)
            .then(id => {
                this.storage.set('id', id)

                return true
            })
    },

    /**
     * Checks wether user is logged in
     * 
     * @returns {boolean} - The login status (true -> logged in)
     */
    get loggedIn() {
        const id = this.storage.get('id'), token = api.token()

        return typeof id === 'string' && typeof token === 'string'
    },

    /**
     * Logs a user out
     * 
     * @param {string} email - The user's email
     * @param {string} password - The user's password
     * 
     * @returns {boolean} - Confirms log-out 
     */
    logout() {
        this.storage.clear()

        return true
    },

    /**
     * Retrieves user's data
     * 
     * @async
     * 
     * @returns {Promise<Object>} - The user's data 
     */
    retrieve() {
        const id = this.storage.get('id')

        return api.retrieveUser(id)
    },

    /**
     * Updates user's data
     * 
     * @async
     * 
     * @param {string} name  - The user's name
     * @param {string} surname  - The user's surname
     * @param {string} email - The user's email
     * @param {string} password - The user's password
     * @param {string} newEmail - The user's newEmail
     * @param {string} newPassword - The user's newPassword
     * 
     * @returns {Promise<boolean>} - Confirms update 
     */
    update(name, surname, email, password, newEmail, newPassword) {
        const id = this.storage.get('id')

        return api.updateUser(id, name, surname, email, password, newEmail, newPassword)
            .then(() => true)
    },

    /**
     * Unregisters user
     * 
     * @async
     * 
     * @param {string} email - The user's email
     * @param {string} password - The user's password
     * 
     * @returns {Promise<boolean>} - Confirms unregistration 
     */
    unregister(email, password) {
        const id = this.storage.get('id')

        return api.unregisterUser(id, email, password)
            .then(() => this.logout())
    },

    /**
  * @async
  * 
  * @param {string} name
  * 
  * @returns {Promise<boolean>}
  */
    groupCreate(name) {
        const id = this.storage.get('id')

        return api.createGroup(id, name)
            .then(() => true)
    },


    /**
     * List groups by user
     * 
    * @param {string} userId The user id
    * 
    * @throws {Error} If the user does not belong to any group
    * 
    * @returns {Promise<[group]>} The complete group information
    */
    listUserGroup() {
        const id = this.storage.get('id')

        return api.listGroupsByUser(id)
            .then(() => true)
    },

    /**
     * List groups by user
     * 
    * @param {string} userId The user id
    * @param {string} email The email of the user to include in the group
    * 
    * @throws {Error} If the user does not belong to any group
    * 
    * @returns {Promise<[group]>} The complete group information
    */
    groupAddUser(email) {
        const id = this.storage.get('id')

        return api.addUserToGroup(id, email)
            .then(() => true)
    }
}

export default logic // babel
// if (typeof module === 'object') module.exports = logic