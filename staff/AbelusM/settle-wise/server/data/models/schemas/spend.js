const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    amount: {
        type: Number,
        required: true
    },
    payer: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    fractions: [{
        user: {
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