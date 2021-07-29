import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import axios from 'axios'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("a new note...")
  const [showAll, setShowAll] = useState(true)

  const hook = () => {
    console.log('effect')
    axios.get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }

  // gets notes from the server
  useEffect(hook, []) // the [] in the second parameter means call only once
                      // on the first rendering
  console.log('render', notes.length, 'notes')

  const createNote = (content) => {
    return {
      id: notes.length + 1,
      content: content,
      date: new Date().toISOString(),
      important: Math.random() < 0.5
    }
  }

  const addNote = (event) => {
    event.preventDefault()
    const note = createNote(newNote)
    // add newNote into the array of notes
    setNotes(notes.concat(note))
    // make the newNote variable empty so the user can type again
    setNewNote('')
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = () => {
    return showAll ? notes : notes.filter(note => note.important === true)
  }

  const handleShowAllToggle = () => {
    setShowAll(!showAll)
  }

  return (
    <div>
      <h1>Notes</h1>
      <button onClick={handleShowAllToggle}>
        show {showAll ? "important" : "all"}
      </button>
      <ul>
        {notesToShow().map(note =>
          <Note key={note.id} content={note.content} />
        )}
      </ul>
      <SimpleForm value={newNote} onSubmit={addNote} onChange={handleNoteChange}/>
    </div>
  )
}

const SimpleForm = ({ value, onSubmit, onChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        value={value}
        onChange={onChange}
      />
      <button type="submit">save</button>
    </form>
  )
}

export default App