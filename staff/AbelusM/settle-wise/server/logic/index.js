'use strict'

const { mongoose, models: { User, Group, Spend } } = require('data')
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
    * @param {string} userId A user that already belongs to the group and invites a new user by its email
    * @param {string} groupId The Id of the Group
    * @param {string} email The including user email 
    * 
    * @throws {Error} If the Group does not exist
    * 
    * @returns {Promise<string>} All the users inside the group
    */
    addUserToGroup(userId, groupId, email) {
        return Promise.resolve()
            .then(() => {
                if (typeof groupId !== 'string') throw Error('group id is not a string')

                if (!(groupId = groupId.trim()).length) throw Error('group id is empty or blank')

                if (typeof email !== 'string') throw Error('user email is not a string')

                if (!(email = email.trim()).length) throw Error('user email is empty or blank')

                return User.findById(userId)
                    .then(user => {
                        if (!user) throw Error(`no user found with id ${userId}`)

                        return User.findOne({ email })
                            .then(user => {
                                return Group.findByIdAndUpdate(groupId, { $push: { users: user._id } })
                                    .then(group => {
                                        if (!group) throw Error(`no group found with id ${groupId}`)

                                        if (!group.users.some(_userId => _userId.toString() === userId)) throw Error(`user with id ${userId} does not belong to group with id ${groupId}`)

                                        return true
                                    })
                            })
                    })
            })
    },

    /**
        * 
        * @param {string} groupId
        * @param {Number} amount
        * @param {string} payerId of the user who pays
        * @param {[{user: string, fraction: Number}]} fractions 
        * 
        * @returns {Promise<string>}
        */
    addSpend(userId, groupId, amount, payerId, fractions) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('user id is not a string')

                if (!(userId = userId.trim()).length) throw Error('user id is empty or blank')

                if (typeof groupId !== 'string') throw Error('group id is not a string')

                if (!(groupId = groupId.trim()).length) throw Error('group id is empty or blank')

                if (typeof payerId !== 'string') throw Error('user id is not a string')

                if (!(payerId = payerId.trim()).length) throw Error('user id is empty or blank')

                if (!(fractions instanceof Array)) throw Error('fractions is not an array')

                if (typeof amount !== 'number') throw Error('amount is not a number')

                // TODO validate amount vs fractions coherence

                for (let i = 0; i < fractions.length; i++) {
                    for (let n = 0; n < fractions[i].fraction.length; i++) {
                        let res = + fractions[i].fraction[n]
                        if (amount !== res) throw Error('amount is not equal to the sum of fractions')
                    }
                }

                const userIds = [payerId]

                const promises = [User.findById(payerId)]

                fractions.forEach(fraction => {
                    userIds.push(fraction.user)

                    promises.push(User.findById(fraction.user))
                })

                return Promise.all(promises)
                    .then(users => {
                        users.forEach((user, index) => {
                            if (!user) throw Error(`no user found with id ${userIds[index]}`)
                        })

                        return Group.findById(groupId)
                            .then(group => {
                                if (!group) throw Error(`no group found with id ${group}`)

                                if (!group.users.some(_userId => _userId.toString() === userId)) throw Error(`user with id ${userId} does not belong to group with id ${groupId}`)

                                group.spends.push(new Spend({
                                    user: userId,
                                    amount,
                                    payer: payerId,
                                    fractions
                                }))

                                return group.save()
                            })
                            .then(() => true)
                    })
            })
    },

    /**
      * @param {string} groupId
      * 
      * @returns {Promise<[Spend]>}
      */
    listSpends(userId, groupId) {
        return Promise.resolve()
            .then(() => {
                if (typeof userId !== 'string') throw Error('group id is not a string')

                if (!(userId = userId.trim()).length) throw Error('group id is empty or blank')

                if (typeof groupId !== 'string') throw Error('group id is not a string')

                if (!(groupId = groupId.trim()).length) throw Error('group id is empty or blank')

                return Group.findById(groupId)
                    .then(group => {
                        if (!group) throw Error(`no group found with id ${groupId}`)

                        if (!group.users.some(_userId => _userId.toString() === userId)) throw Error(`user with id ${userId} does not belong to group with id ${groupId}`)

                        return group.spends.map(({ id, amount, payer, fractions }) => {
                            const _fractions = fractions.map(({ user, fraction }) => ({ userId: user.toString(), fraction }))

                            return { id, amount, payerId: payer.toString(), fractions: _fractions }
                        })
                    })
            })
    }
}

module.exports = logic