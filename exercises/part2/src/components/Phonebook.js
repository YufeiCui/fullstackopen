import React, { useState } from 'react'
import Notification from './Notification'

const Phonebook = ({ persons, addPhoneNumber, deletePhoneNumberOf, notification }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setFilterString] = useState('')

  const resetFields = () => {
    setNewName('')
    setNewNumber('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addPhoneNumber({
      name: newName,
      number: newNumber
    })
    resetFields()
  }

  const handleDelete = (person) => {
    deletePhoneNumberOf(person)
  }

  const handleChange = (handler) => {
    // return a function that takes in event target value given the handler
    return (event) => {
      handler(event.target.value)
    }
  }

  const handleChanges = [
    handleChange(setNewName),
    handleChange(setNewNumber),
  ]

  const filteredPersons = persons.filter(person => {
    return person.name.toLowerCase().includes(filterString.toLowerCase())
  })

  return (
    <div>
      <Subheading text="Phonebook" />
      <Notification notification={notification}/>
      <Filter filterString={filterString} onChange={handleChange(setFilterString)} />
      <Subheading text="Add a new" />
      <PersonForm name={newName} number={newNumber} onChange={handleChanges} onSubmit={handleSubmit} />
      <Subheading text="Numbers" />
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

const Subheading = ({ text }) => {
  return (
    <h2>{text}</h2>
  )
}

const Filter = ({ filterString, onChange }) => {
  return (
    <div>
      Filter shown with <input value={filterString} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({ name, number, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={name} onChange={onChange[0]} />
      </div>
      <div>
        number: <input value={number} onChange={onChange[1]} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, handleDelete }) => {
  return (
    <div>
      {persons.map(person => {
        return (
          <div key={person.name}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person)}>delete</button>
          </div>
        )
      })}
    </div>
  )
}

export default Phonebook
