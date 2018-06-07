describe('logic (Project App)', () => {
    logic.init(Xtorage.local)

    const username = 'u', password = 'p'
    let data

    beforeEach(() => data = { name: 'John', surname: 'Doe', age: 40 })

    describe('register > login > check login > unregister', () => {
        it('should succeed on correct user data', () =>
            logic.register(username, password, data)
                .then(res => {
                    expect(res).toBeTruthy()

                    return logic.login(username, password)
                })
                .then(res => {
                    expect(res).toBeTruthy()

                    const token = Xtorage.session.get('token')
                    expect(token).toBeDefined()

                    const id = Xtorage.session.get('id')
                    expect(id).toBeDefined()

                    expect(logic.loggedIn).toBeTruthy()

                    return logic.unregister(username, password)
                })
                .then(res => {
                    expect(res).toBeTruthy()

                    const id = Xtorage.session.get('id')
                    expect(id).toBeNull()

                    const token = Xtorage.session.get('token')
                    expect(token).toBeNull()

                    return logic.login(username, password)
                })
                .catch(err => expect(err).toBeDefined())
        )
    })

    describe('register > login > check login > logout > check login > login > check login > unregister > check login', () => {
        it('should succeed on correct user data', () =>
            logic.register(username, password, data)
                .then(res => {
                    expect(res).toBeTruthy()

                    return logic.login(username, password)
                })
                .then(res => {
                    expect(res).toBeTruthy()

                    let token = Xtorage.session.get('token')
                    expect(token).toBeDefined()

                    let id = Xtorage.session.get('id')
                    expect(id).toBeDefined()

                    expect(logic.loggedIn).toBeTruthy()

                    logic.logout()

                    token = Xtorage.session.get('token')
                    expect(token).toBeNull()

                    id = Xtorage.session.get('id')
                    expect(id).toBeNull()

                    expect(logic.loggedIn).toBeFalsy()

                    return logic.login(username, password)
                })
                .then(res => {
                    expect(res).toBeTruthy()

                    let token = Xtorage.session.get('token')
                    expect(token).toBeDefined()

                    let id = Xtorage.session.get('id')
                    expect(id).toBeDefined()

                    expect(logic.loggedIn).toBeTruthy()

                    return logic.unregister(username, password)
                })
                .then(res => {
                    expect(res).toBeTruthy()

                    const id = Xtorage.session.get('id')
                    expect(id).toBeNull()

                    const token = Xtorage.session.get('token')
                    expect(token).toBeNull()

                    expect(logic.loggedIn).toBeFalsy()

                    return logic.login(username, password)
                })
                .catch(err => expect(err).toBeDefined())
        )
    })

    describe('register > login > retrieve > unregister', () => {
        it('should succeed on correct user data', () =>
            logic.register(username, password, data)
                .then(res => {
                    expect(res).toBeTruthy()

                    return logic.login(username, password)
                })
                .then(res => {
                    expect(res).toBeTruthy()

                    let token = Xtorage.session.get('token')
                    expect(token).toBeDefined()

                    let id = Xtorage.session.get('id')
                    expect(id).toBeDefined()

                    return logic.retrieve()
                })
                .then(user => {
                    expect(user).toBeDefined()

                    expect(user.username).toBe(username)
                    expect(user.name).toBe(data.name)
                    expect(user.surname).toBe(data.surname)
                    expect(user.age).toBe(data.age)

                    return logic.unregister(username, password)
                })
                .then(res => {
                    expect(res).toBeTruthy()

                    const id = Xtorage.session.get('id')
                    expect(id).toBeNull()

                    const token = Xtorage.session.get('token')
                    expect(token).toBeNull()

                    return logic.login(username, password)
                })
                .catch(err => expect(err).toBeDefined())
        )
    })

    describe('register > login > update > retrieve > unregister', () => {
        it('should succeed on correct user data', () =>
            logic.register(username, password, data)
                .then(res => {
                    expect(res).toBeTruthy()

                    return logic.login(username, password)
                })
                .then(res => {
                    expect(res).toBeTruthy()

                    let token = Xtorage.session.get('token')
                    expect(token).toBeDefined()

                    let id = Xtorage.session.get('id')
                    expect(id).toBeDefined()

                    data.newUsername = 'u2'
                    data.newPassword = 'p2'
                    data.name = 'John'
                    data.surname = 'Wayne'
                    data.age = 50

                    return logic.update(username, password, data)
                })
                .then(res => {
                    expect(res).toBeTruthy()

                    return logic.retrieve()
                })
                .then(user => {
                    expect(user).toBeDefined()

                    expect(user.username).toBe(data.newUsername)
                    expect(user.name).toBe(data.name)
                    expect(user.surname).toBe(data.surname)
                    expect(user.age).toBe(data.age)

                    return logic.unregister(user.username, data.newPassword)
                })
                .then(res => {
                    expect(res).toBeTruthy()

                    const id = Xtorage.session.get('id')
                    expect(id).toBeNull()

                    const token = Xtorage.session.get('token')
                    expect(token).toBeNull()

                    return logic.login(data.newUsername, data.newPassword)
                })
                .catch(err => expect(err).toBeDefined())
        )
    })
})