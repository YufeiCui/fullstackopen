import React, { useEffect, useState } from 'react'
import Phonebook from './components/Phonebook'
import phonebookServices from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([
    // { name: 'Arto Hellas', number: '040-123456' },
    // { name: 'Ada Lovelace', number: '39-44-5323523' },
    // { name: 'Dan Abramov', number: '12-43-234345' },
    // { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const hook = () => {
    phonebookServices.getAll()
      .then(persons => {
        setPersons(persons)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(hook, []) // again, the [] means call only first render

  const addPhoneNumber = (newPerson) => {
    const duplicates = persons.find(person => person.name === newPerson.name)
    if (duplicates !== undefined) {
      if (window.confirm(`${newPerson.name} is aleady added to the phonebook, replace the old number with a new one?`)) {
        phonebookServices.updatePhoneNumber(duplicates.id, newPerson).then(updatedPerson => {
          setPersons(persons.map(person => person.id === duplicates.id ? updatedPerson : person))
        }).catch(error => {
          console.log(error)
        })
      }
    } else {
      phonebookServices.addPhoneNumber(newPerson).then(addedPerson => {
        setPersons(persons.concat(addedPerson))
      }).catch(error => {
        console.log(error)
      })
    }
  }

  const deletePhoneNumberOf = (seletedPerson) => {
    if (window.confirm(`Delete ${seletedPerson.name} ?`)) {
      phonebookServices.deletePhoneNumber(seletedPerson.id).then(_ => {
        setPersons(persons.filter(person => person.id !== seletedPerson.id))
      }).catch(error => {
        console.log(error)
      })
    }
  }

  return (
    <Phonebook
      persons={persons}
      addPhoneNumber={addPhoneNumber}
      deletePhoneNumberOf={deletePhoneNumberOf}
    />
  )
}

export default App