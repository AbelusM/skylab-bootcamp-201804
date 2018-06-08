import logic from '../logic'

function CreateGroup(props) {
    const { userId, name } = props

    return logic.createGroup(userId, name)
        .then(group => group.name)
}

export default CreateGroup;