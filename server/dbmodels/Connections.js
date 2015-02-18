var ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
    _id: { type: ObjectId },
    userId: { type: ObjectId, ref: 'User' },
    connectionId: { type: ObjectId, ref: 'User' }
};