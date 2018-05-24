'use strict'

const { MongoClient, ObjectId } = require('mongodb')
const expect = require('expect')
const logic = require('.')

describe('logic (notes)', () => {
    let cn, db, cl
    const _userId = '123'
    const noteText = 'my note'
    const indexes = []

    before(done => {
        MongoClient.connect('mongodb://localhost:27017/skylab-bootcamp-201804-test', { useNewUrlParser: true }, (err, conn) => {
            if (err) throw err

            cn = conn
            db = cn.db()
            cl = db.collection('notes')

            logic.init(db)

            done()
        })
    })

    beforeEach(() => {
        let count = 3 + Math.round(Math.random() * 10)
        indexes.length = 0
        while (count--) indexes.push(count)

        return cl.deleteMany()
    })

    after(done => db.dropDatabase(() => cn.close(done)))

    describe('add note', () => {
        it('should add on correct data', () =>
            logic.addNote(_userId, noteText)
                .then(id => {
                    expect(id).toBeDefined()

                    return cl.findOne({ _id: ObjectId(id) })
                        .then(({ _id, userId, text }) => {
                            expect(_id).toBeDefined()
                            expect(_id.toString()).toBe(id)
                            expect(userId).toBe(_userId)
                            expect(text).toBe(noteText)
                        })
                })
        )

        it('should add notes with different ids', () => {
            const additions = indexes.map(index => logic.addNote(_userId, `${noteText} ${index}`))

            return Promise.all(additions)
                .then(ids => {
                    expect(ids.length).toBe(indexes.length)

                    ids.forEach((id, index) => {
                        if (index < ids.length - 1)
                            expect(id).not.toBe(ids[index + 1])
                        else
                            expect(id).not.toBe(ids[0])
                    })

                    const retrievals = ids.map(id => cl.findOne({ _id: ObjectId(id) }))

                    return Promise.all(retrievals)
                        .then(notes => {
                            expect(notes.length).toBe(indexes.length)

                            notes.forEach(({ _id, userId, text }, index) => {
                                expect(_id.toString()).toBe(ids[index])
                                expect(userId).toBe(_userId)
                                expect(text).toBe(`${noteText} ${indexes[index]}`)
                            })
                        })
                })
        })

        it('should throw error on no userId', () =>
            logic.addNote()
                .catch(({ message }) => expect(message).toBe('userId is not a string'))
        )

        it('should throw error on empty userId', () =>
            logic.addNote('')
                .catch(({ message }) => expect(message).toBe('userId is empty or blank'))
        )

        it('should throw error on blank userId', () =>
            logic.addNote('     ')
                .catch(({ message }) => expect(message).toBe('userId is empty or blank'))
        )

        it('should throw error on no text', () => {
            logic.addNote(_userId)
                .catch(({ message }) => expect(message).toBe('text is not a string'))
        })

        it('should throw error on empty text', () =>
            logic.addNote(_userId, '')
                .catch(({ message }) => expect(message).toBe('text is empty or blank'))
        )

        it('should throw error on blank text', () =>
            logic.addNote(_userId, '   ')
                .catch(({ message }) => expect(message).toBe('text is empty or blank'))
        )
    })

    describe('list notes', () => {
        it('should succeed on correct data', () => {
            let additions = indexes.map(index => logic.addNote(_userId, `${noteText} ${index}`))

            const _userId2 = '456'

            additions = additions.concat(indexes.map(index => logic.addNote(_userId2, `${noteText} ${index + indexes.length}`)))

            return Promise.all(additions)
                .then(ids => {
                    return logic.listNotes(_userId)
                        .then(notes => {
                            expect(notes.length).toBe(indexes.length)

                            const validIds = ids.slice(0, indexes.length)
                            const validTexts = indexes.map(index => `${noteText} ${index}`)

                            notes.forEach(({ _id, userId, text }) => {
                                expect(validIds.includes(_id.toString())).toBeTruthy()
                                expect(userId).toBe(_userId)
                                expect(validTexts.includes(text)).toBeTruthy()
                            })
                        })
                })
        })

        it('should throw error on non userId', () =>
            logic.listNotes()
                .catch(({ message }) => expect(message).toBe('userId is not a string'))
        )

        it('should throw error on empty userId', () =>
            logic.listNotes('')
                .catch(({ message }) => expect(message).toBe('userId is empty or blank'))
        )

        it('should throw error on blank userId', () =>
            logic.listNotes('      ')
                .catch(({ message }) => expect(message).toBe('userId is empty or blank'))
        )
    })

    describe('retrieve note', () => {
        it('should succeed on correct data', () => {
            const _note = { text: noteText, userId: _userId }
            const invalidUserId = '456'

            return cl.insertOne(_note)
                .then(() => logic.retrieveNote(_userId, _note._id.toString()))
                .then(({ _id, userId, text }) => {
                    expect(_id.toString()).toBe(_note._id.toString())
                    expect(userId).toBe(_userId)
                    expect(text).toBe(noteText)

                    return logic.retrieveNote(invalidUserId, _id.toString())
                        .catch(({ message }) => expect(message).toBe(`note with id ${_id} does not exist for userId ${invalidUserId}`))
                })
        })

        it('should throw error on non userId', () =>
            logic.retrieveNote()
                .catch(({ message }) => expect(message).toBe('userId is not a string'))
        )

        it('should throw error on empty userId', () =>
            logic.retrieveNote('')
                .catch(({ message }) => expect(message).toBe('userId is empty or blank'))
        )

        it('should throw error on blank userId', () =>
            logic.retrieveNote('      ')
                .catch(({ message }) => expect(message).toBe('userId is empty or blank'))
        )

        it('should throw error on wrong userId', () =>
            logic.addNote(_userId, 'my note')
                .then(id => {
                    const invalidUserId = 'wrong-id'

                    return logic.retrieveNote(invalidUserId, id)
                        .catch(({ message }) => expect(message).toBe(`note with id ${id} does not exist for userId ${invalidUserId}`))
                })
        )

        it('should throw error on no id', () =>
            logic.retrieveNote(_userId)
                .catch(({ message }) => expect(message).toBe('id is not a string'))
        )

        it('should throw error on empty id', () =>
            logic.retrieveNote(_userId, '')
                .catch(({ message }) => expect(message).toBe('id is empty or blank'))
        )

        it('should throw error on blank id', () =>
            logic.retrieveNote(_userId, '       ')
                .catch(({ message }) => expect(message).toBe('id is empty or blank'))
        )

        it('should throw error on wrong id', () =>
            logic.addNote(_userId, 'my note')
                .then(id => {
                    const invalidNoteId = '123456781234567812345678'

                    return logic.retrieveNote(_userId, invalidNoteId)
                        .catch(({ message }) => expect(message).toBe(`note with id ${invalidNoteId} does not exist for userId ${_userId}`))
                })
        )
    })

    describe('remove note', () => {
        it('should remove a note', () => {
            const _note = { text: noteText, userId: _userId }
            const invalidUserId = '456'

            return cl.insertOne(_note)
                .then(() => logic.removeNote(invalidUserId, _note._id.toString()))
                .catch(({ message }) => expect(message).toBe(`note with id ${_note._id} does not exist for userId ${invalidUserId}`))
                .then(() => logic.removeNote(_userId, _note._id.toString()))
                .then(() => cl.findOne({ _id: _note._id, userId: _userId }))
                .then(note => expect(note).toBeNull())

        })

        it('should throw error on non userId', () =>
            logic.removeNote()
                .catch(({ message }) => expect(message).toBe('userId is not a string'))
        )

        it('should throw error on empty userId', () =>
            logic.removeNote('')
                .catch(({ message }) => expect(message).toBe('userId is empty or blank'))
        )

        it('should throw error on blank userId', () =>
            logic.removeNote('      ')
                .catch(({ message }) => expect(message).toBe('userId is empty or blank'))
        )

        it('should throw error on wrong userId', () =>
            logic.addNote(_userId, 'my note')
                .then(id => {
                    const invalidUserId = 'wrong-id'

                    return logic.removeNote(invalidUserId, id)
                        .catch(({ message }) => expect(message).toBe(`note with id ${id} does not exist for userId ${invalidUserId}`))
                })
        )

        it('should throw error on no id', () =>
            logic.removeNote(_userId)
                .catch(({ message }) => expect(message).toBe('id is not a string'))
        )

        it('should throw error on empty id', () =>
            logic.removeNote(_userId, '')
                .catch(({ message }) => expect(message).toBe('id is empty or blank'))
        )

        it('should throw error on blank id', () =>
            logic.removeNote(_userId, '       ')
                .catch(({ message }) => expect(message).toBe('id is empty or blank'))
        )

        it('should throw error on wrong id', () =>
            logic.addNote(_userId, 'my note')
                .then(id => {
                    const invalidNoteId = '123456781234567812345678'

                    return logic.removeNote(_userId, invalidNoteId)
                        .catch(({ message }) => expect(message).toBe(`note with id ${invalidNoteId} does not exist for userId ${_userId}`))
                })
        )
    })

    describe('update note', () => {
        it('should succeed on correct data', () => {
            const _note = { text: noteText, userId: _userId }
            const invalidUserId = '456'
            const newNoteText = 'my new note'

            return cl.insertOne(_note)
                .then(() => logic.updateNote(invalidUserId, _note._id.toString(), newNoteText))
                .catch(({ message }) => expect(message).toBe(`note with id ${_note._id} does not exist for userId ${invalidUserId}`))
                .then(() => logic.updateNote(_userId, _note._id.toString(), newNoteText))
                .then(() => cl.findOne({ _id: _note._id, userId: _userId }))
                .then(({ _id, userId, text }) => {
                    expect(_id.toString()).toBe(_note._id.toString())
                    expect(userId).toBe(_userId)
                    expect(text).toBe(newNoteText)
                })
        })

        false && it('should throw error on non userId', () => {
            expect(() => logic.updateNote()).toThrowError('userId is not a string')
        })

        false && it('should throw error on empty userId', () => {
            expect(() => logic.updateNote('')).toThrowError('userId is empty or blank')
        })

        false && it('should throw error on blank userId', () => {
            expect(() => logic.updateNote('      ')).toThrowError('userId is empty or blank')
        })

        false && it('should throw error on wrong userId', () => {
            const id = logic.addNote(_userId, 'my note')

            expect(() => logic.updateNote('wrong-id', id, 'my new note')).toThrowError(`note with id ${id} does not exist for userId wrong-id`)
        })

        false && it('should throw error on no id', () => {
            expect(() => logic.updateNote(_userId)).toThrowError('id is not a string')
        })

        false && it('should throw error on empty id', () => {
            expect(() => logic.updateNote(_userId, '')).toThrowError('id is empty or blank')
        })

        false && it('should throw error on blank id', () => {
            expect(() => logic.updateNote(_userId, '             ')).toThrowError('id is empty or blank')
        })

        false && it('should throw error on wrong id', () => {
            const id = logic.addNote(_userId, 'my note')

            expect(() => logic.updateNote(_userId, 'wrong-id', 'my new note')).toThrowError(`note with id wrong-id does not exist for userId ${_userId}`)
        })

        false && it('should throw error on no text', () => {
            expect(() => logic.updateNote(_userId, '123')).toThrowError('text is not a string')
        })

        false && it('should throw error on empty text', () => {
            expect(() => logic.updateNote(_userId, '123', '')).toThrowError('text is empty or blank')
        })

        false && it('should throw error on blank text', () => {
            expect(() => logic.updateNote(_userId, '123', '             ')).toThrowError('text is empty or blank')
        })
    })

    false && describe('search notes', () => {
        it('should return results on matching text', () => {
            expect(_notes.length).toBe(0)

            const id1 = logic.addNote(_userId, 'my note 1')
            const id2 = logic.addNote(_userId, 'my note 11')
            const id3 = logic.addNote(_userId, 'my note 111')

            let res = logic.findNotes('456', '11')

            expect(res).toBeDefined()
            expect(res.length).toBe(0)

            res = logic.findNotes(_userId, '11')

            expect(res).toBeDefined()
            expect(res.length).toBe(2)

            const [note1, note2] = res

            expect(note1).toBeDefined()
            expect(note1.id).toBe(id2)
            expect(note1.text).toBe('my note 11')
            expect(note1.userId).toBe(_userId)

            expect(note2).toBeDefined()
            expect(note2.id).toBe(id3)
            expect(note2.text).toBe('my note 111')
            expect(note2.userId).toBe(_userId)
        })

        it('should return results on matching text case', () => {
            expect(_notes.length).toBe(0)

            const id1 = logic.addNote(_userId, 'my note a')
            const id2 = logic.addNote(_userId, 'my note aA')
            const id3 = logic.addNote(_userId, 'my note aAa')

            let res = logic.findNotes('456', '11')

            expect(res).toBeDefined()
            expect(res.length).toBe(0)

            res = logic.findNotes(_userId, 'aA')

            expect(res).toBeDefined()
            expect(res.length).toBe(2)

            const [note1, note2] = res

            expect(note1).toBeDefined()
            expect(note1.id).toBe(id2)
            expect(note1.text).toBe('my note aA')
            expect(note1.userId).toBe(_userId)

            expect(note2).toBeDefined()
            expect(note2.id).toBe(id3)
            expect(note2.text).toBe('my note aAa')
            expect(note2.userId).toBe(_userId)
        })

        it('should throw error on no text', () => {
            expect(() => logic.findNotes(_userId)).toThrowError('text is not a string')
        })

        it('should throw error on empty text', () => {
            expect(() => logic.findNotes(_userId, '')).toThrowError('text is empty')
        })

        it('should throw error on no text', () => {
            expect(() => logic.findNotes(_userId)).toThrowError('text is not a string')
        })

        it('should throw error on empty text', () => {
            expect(() => logic.findNotes(_userId, '')).toThrowError('text is empty')
        })
    })
})

