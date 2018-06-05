'use strict'

require('dotenv').config()

const { mongoose, models: { User, Apartment } } = require('data')
const logic = require('.')
const { expect } = require('chai')

const { env: { DB_URL } } = process

describe('logic (sweet-home)', () => {

    before(() => mongoose.connect(DB_URL))

    beforeEach(() => User.remove())

    describe('register user', () => {
        it('should succeed on correct data', () =>
            logic.registerUser('Nur', 'C', '689456739', '45629856L', '1234')
                .then(res => expect(res).to.be.true)
        )

        it('should fail on existing dni', () => {
            User.create({ name: 'Nur', surname: 'C', phone: '689456739', dni: '45629856L', password: '1234' })
                .then(() => {
                    return logic.registerUser('Mar', 'L', '685243497', '45629856L', '5678')
                        .catch(({ message }) => expect(message).to.equal('existing dni'))
                })
        })
    })

    after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done)))
})
