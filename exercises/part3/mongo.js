const mongoose = require('mongoose')

const argc = process.argv.length

if (argc < 3 || argc == 4 || argc > 5) {
    console.log('Please follow the script argument constraints: node mongo.js <password> {name} {number}')
    process.exit(1)
}

const password = process.argv[2]
const db = 'exercise'
const url = `mongodb+srv://cuiyufei:${password}@fullstackopen-part3.o1xii.mongodb.net/${db}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const printAll = () => {
    console.log("Phonebook:")
    Person.find({}).then(result => {
        if (result.length === 0) {
            console.log("No Entries")
        }
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })

        mongoose.connection.close()
    })
}

const addPerson = (name, number) => {
    const person = new Person({ name, number })
    person.save().then(result => {
        console.log(`added ${name} ${number} to phonebook!`)
        mongoose.connection.close()
    })
}

if (argc == 3) {
    printAll()
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    addPerson(name, number)
}