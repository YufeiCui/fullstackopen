import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("a new note...")
  const [showAll, setShowAll] = useState(true)

  const hook = () => {
    // console.log('effect')
    noteService.getAll().then(notes => {
      // console.log('promise fulfilled')
      setNotes(notes)
    })
  }

  // gets notes from the server
  useEffect(hook, []) // the [] in the second parameter means call only once
                      // on the first rendering
  // console.log('render', notes.length, 'notes')

  const createNote = (content) => {
    return {
      content: content,
      date: new Date().toISOString(),
      important: Math.random() < 0.5
    }
  }

  const addNote = (event) => {
    event.preventDefault()
    const note = createNote(newNote)
    // add newNote to the server
    noteService.create(note).then(newNote => {
      // console.log('ADDED NEW NOTE', response.data)
      // add newNote into the array of notes if post was successful
      setNotes(notes.concat(newNote))
    })
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

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    if (note !== undefined) {
      // update note
      const changedNote = {...note, important: !note.important}
      noteService.update(id, changedNote).then(newNote => {
        // console.log(`note ${id} is updated!`)
        // update the changed note in our local state
        setNotes(notes.map(note => note.id === id ? newNote : note))
      })
    }
  }

  return (
    <div>
      <h1>Notes</h1>
      <button onClick={handleShowAllToggle}>
        show {showAll ? "important" : "all"}
      </button>
      <ul>
        {notesToShow().map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
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