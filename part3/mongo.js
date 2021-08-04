const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const db = 'note-app'

const url = `mongodb+srv://cuiyufei:${password}@fullstackopen-part3.o1xii.mongodb.net/${db}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'This is the 4th and last note inserted',
    date: new Date(),
    important: true
})


// note.save().then(res => {
//     console.log(`Note: ${note} saved!`)
//     mongoose.connection.close()
// })

Note.find({ important: true }).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})