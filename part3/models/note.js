const mongoose = require('mongoose')

const URL = process.env.MONGODB_URI

console.log('Connecting to DB')

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
    return result
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

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
noteSchema.set('toJSON ', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(),
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema)