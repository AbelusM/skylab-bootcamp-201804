const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    fractions: [{
        userId: {
            type: ObjectId,
            ref: 'User',
            required: true
        },
        fraction: {
            type: Number,
            required: true
        }
    }]
})