const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true // so mongoose will raise error if this is missing
  },
  date: {
    type: Date,
    required: true
  },
  important: Boolean
})

// modifiy what's returned by the 'toJSON' method of the schema
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema)