import React, { useEffect, useState } from 'react'
import Phonebook from './components/Phonebook'
import phonebookServices from './services/phonebook'

const App = () => {
  // { name: 'Arto Hellas', number: '040-123456' },
  // { name: 'Ada Lovelace', number: '39-44-5323523' },
  // { name: 'Dan Abramov', number: '12-43-234345' },
  // { name: 'Mary Poppendieck', number: '39-23-6423122' }
  const [persons, setPersons] = useState([])
  const [notification, setNotification] = useState(null)

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

  const notificationHook = () => {
    if (notification != null) {
      const timeoutId = setTimeout(() => {
        setNotification(null)
      }, 3000)

      // clean-up: called to remove previous useEffect call
      return () => clearTimeout(timeoutId)
    }
  }

  useEffect(notificationHook, [notification])

  const addPhoneNumber = (newPerson) => {
    const duplicates = persons.find(person => person.name === newPerson.name)
    if (duplicates !== undefined) {
      if (window.confirm(`${newPerson.name} is aleady added to the phonebook, replace the old number with a new one?`)) {
        phonebookServices.updatePhoneNumber(duplicates.id, newPerson).then(updatedPerson => {
          setPersons(persons.map(person => person.id === duplicates.id ? updatedPerson : person))
          setNotification({
            message: `Updated ${updatedPerson.name}`,
            isError: false
          })
        }).catch(error => {
          console.log(error)
          setNotification({
            message: `Information of ${duplicates.name} has already been deleted from the server`,
            isError: true
          })
        })
      }
    } else {
      phonebookServices.addPhoneNumber(newPerson).then(addedPerson => {
        setPersons(persons.concat(addedPerson))
        setNotification({
          message: `Added ${addedPerson.name}`,
          isError: false
        })
      }).catch(error => {
        const errorObject = error.response.data
        setNotification({
          message: errorObject.error,
          isError: true
        })
      })
    }
  }

  const deletePhoneNumberOf = (seletedPerson) => {
    if (window.confirm(`Delete ${seletedPerson.name} ?`)) {
      phonebookServices.deletePhoneNumber(seletedPerson.id).then(_ => {
        setPersons(persons.filter(person => person.id !== seletedPerson.id))
        setNotification({
          message: `Deleted ${seletedPerson.name}`,
          isError: false
        })
      }).catch(error => {
        console.log(error)
        setNotification({
          message: `Information of ${seletedPerson.name} does not exist, it might have already been deleted from the server`,
          isError: true
        })
      })
    }
  }

  return (
    <Phonebook
      notification={notification}
      persons={persons}
      addPhoneNumber={addPhoneNumber}
      deletePhoneNumberOf={deletePhoneNumberOf}
    />
  )
}

export default App