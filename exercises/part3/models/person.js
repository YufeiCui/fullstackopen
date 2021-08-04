const mongoose = require('mongoose')

const URL = process.env.MONGODB_URI

console.log('Connecting to DB')

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB!')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

// define person schema and export person model basde on scheme

const personSchema = new mongoose.Schema({
    "name": String,
    "number": String
})

// modifiy what's returned by the 'toJSON' method of the schema
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)