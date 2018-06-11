import logic from '../logic'
import { identifier } from 'babel-types';

function CreateGroup(props) {
    const { userId, name } = props

    groupName = name.toString()

    return logic.createGroup(groupName)
        .then(group => group.name)
}

export default CreateGroup;