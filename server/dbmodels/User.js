var ObjectId = require('mongoose-simpledb').Types.ObjectId;
var md5 = require('MD5');

exports.schema = {
    _id: { type: ObjectId },
    firstName: String,
    lastName: String,
    email: String,
    date: { type: Date, default: Date.now },
    login: String,
    password: String,
    roomId: String
};

exports.methods = {
  generateUniqueRoomId: function() {
      this.roomId = md5(this.firstName + this.lastName + this.date.valueOf);
  }
};