'use strict'

const { mongoose, models: { User, Group } } = require('data')
const { Types: { ObjectId } } = mongoose

const logic = {

    /**
     * Register user 
     * 
     * @param {string} name name of the user
     * @param {string} surname surname of the user
     * @param {string} email used as userName too
     * @param {string} password 
     * 
     * @throws {Error} if register email already exists
     * 
     * @returns {Promise<string>} the user ID
     */
    registerUser(name, surname, email, password) {
        return Promise.resolve()
            .then(() => {

                if (typeof name !== 'string') throw Error('user name is not a string')

                if (!(name = name.trim()).length) throw Error('user name is empty or blank')

                if (typeof surname !== 'string') throw Error('user surname is not a string')

                if ((surname = surname.trim()).length === 0) throw Error('user surname is empty or blank')

                if (typeof email !== 'string') throw Error('user email is not a string')

                if (!(email = email.trim()).length) throw Error('user email is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')

                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                return User.findOne({ email })
                    .then(user => {
                        if (user) throw Error(`user with email ${email} already exists`)

                        return User.create({ name, surname, email, password })
                            .then(user => user._id)
                    })
            })
    },

    /**
     * Authenticate user to retrieve user id and token
     * 
     * @param {string} email user email
     * @param {string} password password of the user
     * 
     * @throws {Error} if the user does not exist
     * 
     * @returns {Promise<string>} the user id
     * 
     */
    authenticateUser(email, password) {
        return Promise.resolve()
            .then(() => {
                if (typeof email !== 'string') throw Error('user email is not a string')

                if (!(email = email.trim()).length) throw Error('user email is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')

                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                return User.findOne({ email, password })
            })
            .then(user => {
                if (!user) throw Error('wrong credentials')

                return user.id
            })
    },

    /**
    * Retrieves the user's information
    * 
    * @param {string} id The user Id
    * 
    * @throws {Error} If the user id is not found
    * 
    * @returns {Promise<User>} All the information of the user
    */
    retrieveUser(id) {
        return Promise.resolve()
            .then(() => {
                if (typeof id !== 'string') throw Error('user id is not a string')

                if (!(id = id.trim()).length) throw Error('user id is empty or blank')

                return User.findById(id).select({ _id: 0, name: 1, surname: 1, email: 1 })
            })
            .then(user => {
                if (!user) throw Error(`no user found with id ${id}`)

                return user
            })
    },

    /**
     * Updates the user information, if email and password are not changed the originals will persist
     * 
     * @param {string} id Necessary to look for the user
     * @param {string} name optional - user name
     * @param {string} surname optional - surname of the user
     * @param {string} email optional - email of the user
     * @param {string} password optional - password of the user
     * @param {string} [newEmail] optional - change email
     * @param {string} [newPassword] optional - change password
     * 
     * @returns {Promise<boolean>} True, if the changes are applied
     */
    updateUser(id, name, surname, email, password, newEmail, newPassword) {
        return Promise.resolve()
            .then(() => {
                if (typeof id !== 'string') throw Error('user id is not a string')

                if (!(id = id.trim()).length) throw Error('user id is empty or blank')

                if (typeof name !== 'string') throw Error('user name is not a string')

                if (!(name = name.trim()).length) throw Error('user name is empty or blank')

                if (typeof surname !== 'string') throw Error('user surname is not a string')

                if ((surname = surname.trim()).length === 0) throw Error('user surname is empty or blank')

                if (typeof email !== 'string') throw Error('user email is not a string')

                if (!(email = email.trim()).length) throw Error('user email is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')

                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                return User.findOne({ email, password })
            })
            .then(user => {
                if (!user) throw Error('wrong credentials')

                if (user.id !== id) throw Error(`no user found with id ${id} for given credentials`)

                if (newEmail) {
                    return User.findOne({ email: newEmail })
                        .then(_user => {
                            if (_user && _user.id !== id) throw Error(`user with email ${newEmail} already exists`)

                            return user
                        })
                }

                return user
            })
            .then(user => {
                user.name = name
                user.surname = surname
                user.email = newEmail ? newEmail : email
                user.password = newPassword ? newPassword : password

                return user.save()
            })
            .then(() => true)
    },

    /**
      * Delete a user from the server, using the id to identify and email and password as a credentials
      * 
      * @param {string} id user id
      * @param {string} email user email
      * @param {string} password password of the user
      * 
      * @returns {Promise<boolean>} True, if the changes are applied
      */
    unregisterUser(id, email, password) {
        return Promise.resolve()
            .then(() => {
                if (typeof id !== 'string') throw Error('user id is not a string')

                if (!(id = id.trim()).length) throw Error('user id is empty or blank')

                if (typeof email !== 'string') throw Error('user email is not a string')

                if (!(email = email.trim()).length) throw Error('user email is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')

                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                return User.findOne({ email, password })
            })
            .then(user => {
                if (!user) throw Error('wrong credentials')

                if (user.id !== id) throw Error(`no user found with id ${id} for given credentials`)

                return user.remove()
            })
            .then(() => true)
    },

    /**
     * Creates a group and includes the creator user as a admin 
     * 
     * @param {string} userId The userID that creates the group
     * @param {string} name Group name
     * 
     * @returns {Promise<string>} group ID
     */
    createGroup(userId, name) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof name !== 'string') throw Error('group name is not a string')

                if (!(name = name.trim()).length) throw Error('group name is empty or blank')

                return Group.create({ name, users: [ObjectId(userId)] })
                    .then(res => res._doc._id.toString())
            })
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
    listGroupsByUser(userId) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                return Group.find({ users: userId })
                    .then(groups => {
                        if (!groups) throw Error(`no user found with id ${userId}`)

                        return groups
                    })
            })
    },

    /**
    * Add a existing User to the current Group
    * 
    * @param {string} groupId The Id of the Group
    * @param {string} email The including user email 
    * 
    * @throws {Error} If the Group does not exist
    * 
    * @returns {Promise<string>} All the users inside the group
    */
    addUserToGroup(groupId, email) {
        return Promise.resolve()
            .then(() => {
                if (typeof groupId !== 'string') throw Error('group id is not a string')

                if (!(groupId = groupId.trim()).length) throw Error('group id is empty or blank')

                if (typeof email !== 'string') throw Error('user email is not a string')

                if (!(email = email.trim()).length) throw Error('user email is empty or blank')

                return User.findOne({ email })
                    .then(user => {
                        return Group.findByIdAndUpdate(groupId, { $push: { users: user._id } })
                            .then(group => {
                                if (!group) throw Error(`no group found with id ${groupId}`)

                                return true
                            })
                    })

            })
    },

    /**
        * 
        * @param {string} groupId
        * @param {string} userId of the user who pays
        * @param {number} fraction 
        * 
        * @returns {Promise<string>}
        */
    addSpend(groupId, userId, fraction) {
        return Promise.resolve()
            .then(() => {
                if (typeof groupId !== 'string') throw Error('group id is not a string')

                if (!(groupId = groupId.trim()).length) throw Error('group id is empty or blank')

                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof fraction !== 'number') throw Error('fraction is not a number')

                return Group.findByIdAndUpdate(groupId, { $push: { spends: {fractions: { fraction, userId }} } }, { new: true })
                    .then(group => {
                        if (!group) throw Error(`no group found with id ${group}`)

                        return true
                    })
            })
    },

   /**
     * @param {string} groupId
     * 
     * @returns {Promise<[Spend]>}
     */
    listSpends(groupId) {
        return Promise.resolve()
            .then(() => {
                if (typeof groupId !== 'string') throw Error('group id is not a string')

                if (!(groupId = groupId.trim()).length) throw Error('group id is empty or blank')

                return Group.findById(groupId)
                    .then(group => {
                        if (!group) throw Error(`no group found with id ${groupId}`)

                        return group.spends.map(({ id, fraction }) => ({ id, fraction }))
                    })
            })
    },

//     /**
//      * 
//      * @param {string} userId
//      * @param {string} noteId 
//      *
//      * @returns {Promise<boolean>}
//      */
//     removeNote(userId, noteId) {
//         return Promise.resolve()
//             .then(() => {
//                 if (typeof userId !== 'string') throw Error('user id is not a string')

//                 if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

//                 if (typeof noteId !== 'string') throw Error('note id is not a string')

//                 if (!(noteId = noteId.trim())) throw Error('note id is empty or blank')

//                 return User.findById(userId)
//                     .then(user => {
//                         if (!user) throw Error(`no user found with id ${userId}`)

//                         const note = user.notes.id(noteId)

//                         if (!note) throw Error(`no note found with id ${noteId}`)

//                         note.remove()

//                         return user.save()
//                     })
//                     .then(() => true)
//             })
//     },

//     /**
//      * 
//      * @param {string} userId
//      * @param {string} noteId 
//      * @param {string} text 
//      * 
//      * @returns {Promise<boolean>}
//      */
//     updateNote(userId, noteId, text) {
//         return Promise.resolve()
//             .then(() => {
//                 if (typeof userId !== 'string') throw Error('user id is not a string')

//                 if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

//                 if (typeof noteId !== 'string') throw Error('note id is not a string')

//                 if (!(noteId = noteId.trim())) throw Error('note id is empty or blank')

//                 if (typeof text !== 'string') throw Error('text is not a string')

//                 if ((text = text.trim()).length === 0) throw Error('text is empty or blank')

//                 return User.findById(userId)
//                     .then(user => {
//                         if (!user) throw Error(`no user found with id ${userId}`)

//                         const note = user.notes.id(noteId)

//                         if (!note) throw Error(`no note found with id ${noteId}`)

//                         note.text = text

//                         return user.save()
//                     })
//                     .then(() => true)
//             })
//     },


}

module.exports = logic