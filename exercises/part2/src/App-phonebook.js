import React, { useEffect, useState } from 'react'
import Phonebook from './components/Phonebook'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([
    // { name: 'Arto Hellas', number: '040-123456' },
    // { name: 'Ada Lovelace', number: '39-44-5323523' },
    // { name: 'Dan Abramov', number: '12-43-234345' },
    // { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const hook = () => {
    axios.get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
  }

  useEffect(hook, []) // again, the [] means call only first render

  const addPhoneNumber = (newPerson) => {
    const duplicates = persons.find(person => person.name === newPerson.name)
    if (duplicates !== undefined) {
      alert(`${newPerson.name} is already added to phonebook`)
    } else {
      setPersons(persons.concat(newPerson))
    }
  }

  return (
    <Phonebook persons={persons} addPhoneNumber={addPhoneNumber}></Phonebook>
  )
}

export default App