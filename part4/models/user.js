const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // do NOT return hashed password
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User