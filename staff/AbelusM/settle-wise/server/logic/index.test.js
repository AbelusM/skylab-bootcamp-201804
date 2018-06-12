'use strict'

require('dotenv').config()

const { mongoose, models: { User, Group, Spend } } = require('data')
const logic = require('.')
const { expect } = require('chai')

const { env: { DB_URL } } = process
describe('logic (settle-wise)', () => {
    let userData, userData2, groupData, dummyUserId, dummySpendId, fraction, indexes

    before(() => mongoose.connect(DB_URL))

    beforeEach(() => {
        userData = { name: 'John', surname: 'Doe', email: 'jd@mail.com', password: '123' }
        userData2 = { name: 'Jack', surname: 'Wayne', email: 'jw@mail.com', password: '456' }
        groupData = { name: 'California' }
        dummyUserId = '123456781234567812345678'
        dummySpendId = '123456781234567812345678'
        fraction = 100
        indexes = []

        let count = 10 + Math.floor(Math.random() * 10)
        indexes.length = 0
        while (count--) indexes.push(count)

        return Promise.all([User.remove(), Group.deleteMany()])
    })

    describe('register user', () => {
        it('should succeed on correct dada', () =>
            logic.registerUser('John', 'Doe', 'jd@mail.com', '123')
                .then(res => {
                    expect(res).to.exist
                }))

        it('should fail on already registered user', () =>
            User.create(userData)
                .then(() => {
                    const { name, surname, email, password } = userData

                    return logic.registerUser(name, surname, email, password)
                })
                .catch(({ message }) => {
                    expect(message).to.equal(`user with email ${userData.email} already exists`)
                })
        )

        it('should fail on no user name', () =>
            logic.registerUser()
                .catch(({ message }) => expect(message).to.equal('user name is not a string'))
        )

        it('should fail on empty user name', () =>
            logic.registerUser('')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on blank user name', () =>
            logic.registerUser('     ')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on no user surname', () =>
            logic.registerUser(userData.name)
                .catch(({ message }) => expect(message).to.equal('user surname is not a string'))
        )

        it('should fail on empty user surname', () =>
            logic.registerUser(userData.name, '')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on blank user surname', () =>
            logic.registerUser(userData.name, '     ')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on no user email', () =>
            logic.registerUser(userData.name, userData.surname)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.registerUser(userData.name, userData.surname, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.registerUser(userData.name, userData.surname, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.registerUser(userData.name, userData.surname, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.registerUser(userData.name, userData.surname, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.registerUser(userData.name, userData.surname, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('authenticate user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(() =>
                    logic.authenticateUser('jd@mail.com', '123')
                        .then(id => expect(id).to.exist)
                )
        )

        it('should fail on no user email', () =>
            logic.authenticateUser()
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.authenticateUser('')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.authenticateUser('     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.authenticateUser(userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.authenticateUser(userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.authenticateUser(userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('retrieve user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.retrieveUser(id)
                })
                .then(user => {
                    expect(user).to.exist

                    const { name, surname, email, _id, password } = user

                    expect(name).to.equal('John')
                    expect(surname).to.equal('Doe')
                    expect(email).to.equal('jd@mail.com')

                    expect(_id).to.be.undefined
                    expect(password).to.be.undefined
                })
        )

        it('should fail on no user id', () =>
            logic.retrieveUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.retrieveUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.retrieveUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )
    })

    describe('udpate user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.updateUser(id, 'Jack', 'Wayne', 'jd@mail.com', '123', 'jw@mail.com', '456')
                        .then(res => {
                            expect(res).to.be.true

                            return User.findById(id)
                        })
                        .then(user => {
                            expect(user).to.exist

                            const { name, surname, email, password } = user

                            expect(user.id).to.equal(id)
                            expect(name).to.equal('Jack')
                            expect(surname).to.equal('Wayne')
                            expect(email).to.equal('jw@mail.com')
                            expect(password).to.equal('456')
                        })
                })
        )

        it('should fail on changing email to an already existing user\'s email', () =>
            Promise.all([
                User.create(userData),
                User.create(userData2)
            ])
                .then(([{ id: id1 }, { id: id2 }]) => {
                    const { name, surname, email, password } = userData

                    return logic.updateUser(id1, name, surname, email, password, userData2.email)
                })
                .catch(({ message }) => expect(message).to.equal(`user with email ${userData2.email} already exists`))
        )

        it('should fail on no user id', () =>
            logic.updateUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.updateUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.updateUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no user name', () =>
            logic.updateUser(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('user name is not a string'))
        )

        it('should fail on empty user name', () =>
            logic.updateUser(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on blank user name', () =>
            logic.updateUser(dummyUserId, '     ')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on no user surname', () =>
            logic.updateUser(dummyUserId, userData.name)
                .catch(({ message }) => expect(message).to.equal('user surname is not a string'))
        )

        it('should fail on empty user surname', () =>
            logic.updateUser(dummyUserId, userData.name, '')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on blank user surname', () =>
            logic.updateUser(dummyUserId, userData.name, '     ')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on no user email', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.updateUser(dummyUserId, userData.name, userData.surname, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('unregister user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.unregisterUser(id, 'jd@mail.com', '123')
                        .then(res => {
                            expect(res).to.be.true

                            return User.findById(id)
                        })
                        .then(user => {
                            expect(user).to.be.null
                        })
                })
        )

        it('should fail on no user id', () =>
            logic.unregisterUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.unregisterUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.unregisterUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no user email', () =>
            logic.unregisterUser(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.unregisterUser(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.unregisterUser(dummyUserId, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.unregisterUser(dummyUserId, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.unregisterUser(dummyUserId, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.unregisterUser(dummyUserId, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('create group', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then((user) => {
                    return logic.createGroup(user._id.toString(), groupData.name)
                        .then(groupId => {
                            expect(groupId).to.be.a('string')
                            expect(groupId).to.exist

                            return Group.findById(groupId)
                                .then(group => {
                                    expect(group).to.exist

                                    expect(group.users).to.exist
                                    expect(group.users.length).to.equal(1)

                                    const { users: [_user] } = group

                                    expect(_user._id.toString()).to.equal(user._id.toString())
                                })
                        })
                })
        )
    })

    describe('list groups by user id', () => {
        it('should succeed on correct data', () => {
            return Promise.all([
                new User(userData).save(),
                new User(userData2).save()
            ])
                .then(users => {
                    expect(users).to.exist
                    expect(users.length).to.equal(2)

                    const [user1, user2] = users

                    return Promise.all(indexes.map((index, i) => new Group({ name: `group ${index}`, users: [i < indexes.length / 2 ? user1._id : user2._id] }).save()))
                        .then(groups => {
                            expect(groups.length).to.equal(indexes.length)

                            const validGroupIds = []

                            groups.forEach((group, i) => {
                                expect(group.users.length).to.equal(1)

                                const { users: [user] } = group

                                expect(user._id.toString()).to.equal((i < groups.length / 2 ? user1._id : user2._id).toString())

                                if (i < groups.length / 2) validGroupIds.push(group._id.toString())
                            })

                            return logic.listGroupsByUser(user1._id.toString())
                                .then(groups => {
                                    expect(groups.length).to.equal(validGroupIds.length)

                                    groups.forEach(group => {
                                        expect(group._id).to.exist
                                        expect(validGroupIds).to.include(group._id.toString())

                                        expect(group.users).to.exist
                                        expect(group.users.length).to.equal(1)

                                        const userIds = group.users.map(userId => userId.toString())

                                        expect(userIds).to.include(user1._id.toString())
                                    })
                                })
                        })
                })
        })

        it('should fail on non user id', () =>
            logic.listGroupsByUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.listGroupsByUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.listGroupsByUser('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

    })


    describe('should add a user to a group', () => {
        it('should succeed on correct data', () => {
            return Promise.all([
                new User(userData).save(),
                new User(userData2).save()
            ])
                .then(users => {
                    expect(users).to.exist
                    expect(users.length).to.equal(2)

                    const [user1, user2] = users

                    return Promise.all([
                        new Group({ name: 'Cali', users: [user1._id] }).save()
                    ])
                        .then(groups => {
                            expect(groups.length).to.equal(1)

                            const [group] = groups

                            return logic.addUserToGroup(group.id, user2.email)
                                .then(res => {
                                    expect(res).to.be.true

                                    return Group.find()
                                        .then(groups => {
                                            expect(groups[0].users).contains(user1._id)
                                            expect(groups[0].users).contains(user2._id)
                                        })
                                })
                        })
                })
        })
    })

    describe('add a spend', () => {
        it('should succeed on correct data', () =>
            Promise.all([
                User.create(userData),
                User.create(userData2)
            ])
                .then(res => {
                    const [{ _doc: user1 }, { _doc: user2 }] = res

                    expect(user1).to.exist
                    expect(user1.name).to.equal(userData.name)

                    expect(user2).to.exist
                    expect(user2.name).to.equal(userData2.name)

                    const group = new Group(groupData)

                    group.users.push(user1._id)
                    group.users.push(user2._id)

                    return group.save()
                        .then(group => {
                            expect(group._id).to.exist
                            expect(group.name).to.equal(groupData.name)

                            return logic.addSpend(group._id.toString(), 100, user1._id.toString(), [
                                { user: user1._id.toString(), fraction: 75 },
                                { user: user2._id.toString(), fraction: 25 }
                            ])
                                .then(res => expect(res).to.be.true)
                                .then(() => Group.findById(group.id))
                                .then(group => {
                                    const { users: [userId1, userId2] } = group

                                    expect(userId1.toString()).to.equal(user1._id.toString())
                                    expect(userId2.toString()).to.equal(user2._id.toString())

                                    expect(group.spends).to.exist
                                    expect(group.spends.length).to.equal(1)

                                    const { spends: [spend] } = group

                                    expect(spend._id).to.exist
                                    expect(spend.amount).to.equal(100)
                                    expect(spend.payer).to.exist
                                    expect(spend.payer.toString()).to.equal(user1._id.toString())
                                    expect(spend.fractions).to.exist
                                    expect(spend.fractions.length).to.equal(2)

                                    const { fractions: [fraction1, fraction2] } = spend

                                    expect(fraction1.user).to.exist
                                    expect(fraction1.user.toString()).to.equal(user1._id.toString())
                                    expect(fraction1.fraction).to.equal(75)

                                    expect(fraction2.user).to.exist
                                    expect(fraction2.user.toString()).to.equal(user2._id.toString())
                                    expect(fraction2.fraction).to.equal(25)
                                })
                        })
                })
        )
        it('should throw error on incorrect user', () =>
            Promise.all([
                User.create(userData),
                User.create(userData2)
            ])
                .then(res => {
                    const [{ _doc: user1 }, { _doc: user2 }] = res

                    expect(user1).to.exist
                    expect(user1.name).to.equal(userData.name)

                    expect(user2).to.exist
                    expect(user2.name).to.equal(userData2.name)

                    const group = new Group(groupData)

                    group.users.push(user1._id)
                    group.users.push(user2._id)

                    return group.save()
                        .then(group => {
                            expect(group._id).to.exist
                            expect(group.name).to.equal(groupData.name)

                            return logic.addSpend(group._id.toString(), 100, user1._id.toString(), [
                                { user: user1._id.toString(), fraction: 75 },
                                { user: user2._id.toString(), fraction: 25 }
                            ])
                                .then(res => expect(res).to.be.true)
                                .then(() => Group.findById(group.id))
                                .then(group => {
                                    const { users: [userId1, userId2] } = group

                                    expect(userId1.toString()).to.equal(user1._id.toString())
                                    expect(userId2.toString()).to.equal(user2._id.toString())

                                    expect(group.spends).to.exist
                                    expect(group.spends.length).to.equal(1)

                                    const { spends: [spend] } = group

                                    expect(spend._id).to.exist
                                    expect(spend.amount).to.equal(100)
                                    expect(spend.payer).to.exist
                                    expect(spend.payer.toString()).to.equal(user1._id.toString())
                                    expect(spend.fractions).to.exist
                                    expect(spend.fractions.length).to.equal(2)

                                    const { fractions: [fraction1, fraction2] } = spend

                                    expect(fractions).to.contain(dummyUserId)
                                })
                        })
                })
        )
    })

    describe('list spends', () => {
        it('should succeed on correct data', () => {
            Promise.all([
                User.create(userData),
                User.create(userData2)
            ])
                .then(res => {
                    const [{ _doc: user1 }, { _doc: user2 }] = res

                    expect(user1).to.exist
                    expect(user1.name).to.equal(userData.name)

                    expect(user2).to.exist
                    expect(user2.name).to.equal(userData2.name)

                    const group = new Group(groupData)

                    group.users.push(user1._id)
                    group.users.push(user2._id)

                    const spend = new Spend({
                        amount: 100,
                        payer: user1._id,
                        fractions: [
                            { user: user1._id, fraction: 75 },
                            { user: user2._id, fraction: 25 }
                        ]
                    })
                    const spend2 = new Spend({
                        amount: 200,
                        payer: user1._id,
                        fractions: [
                            { user: user1._id, fraction: 170 },
                            { user: user2._id, fraction: 20 }
                        ]
                    })

                    group.spends.push(spend)
                    group.spends.push(spend2)

                    return group.save()
                        .then(group => {
                            expect(group._id).to.exist
                            expect(group.name).to.equal(groupData.name)

                            const { users: [userId1, userId2] } = group

                            expect(userId1.toString()).to.equal(user1._id.toString())
                            expect(userId2.toString()).to.equal(user2._id.toString())

                            expect(group.spends).to.exist
                            expect(group.spends.length).to.equal(2)

                            const { spends: [spend] } = group

                            expect(spend._id).to.exist
                            expect(spend.amount).to.equal(100)
                            expect(spend.payer).to.exist
                            expect(spend.payer).to.deep.equal(user1._id)
                            expect(spend.fractions).to.exist
                            expect(spend.fractions.length).to.equal(2)

                            const { fractions: [fraction1, fraction2] } = spend

                            expect(fraction1.user).to.exist
                            expect(fraction1.user.toString()).to.equal(user1._id.toString())
                            expect(fraction1.fraction).to.equal(75)

                            expect(fraction2.user).to.exist
                            expect(fraction2.user.toString()).to.equal(user2._id.toString())
                            expect(fraction2.fraction).to.equal(25)

                            return logic.listSpends(group._id.toString())
                                .then(res => {
                                    expect(res).to.exist
                                    expect(res.length).to.equal(2)

                                })
                        })
                })
        })
    })

    after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done)))
})
