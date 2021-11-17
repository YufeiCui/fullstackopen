import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'
import loginService from './services/login'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("a new note...")
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

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

  
  // life cycle of notification
  const notificationHook = () => {
    if (notification !== null) {
      const timeoutid = setTimeout(() => { setNotification(null) }, 5000)
      
      // tear down code: clean up useEffect call
      return () => clearTimeout(timeoutid)
    }
  }
  
  useEffect(notificationHook, [notification])
  
  const setSuccessNotification = message => setNotificationWithTimeout(message, false)
  const setFailureNotification = message => setNotificationWithTimeout(message, true)
  
  const setNotificationWithTimeout = (message, isError) => {
    const notification = { message, isError }
    setNotification(notification)
  }
  
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user)
      noteService.setToken(user.token)
      setUsername('')
      setPassword('')
      setSuccessNotification(`${user.username} has successfully signed in!`)
    } catch (exception) {
      // error message 
      console.log(exception)
      setFailureNotification(`Sign in failed: ${exception}`)
    }
  }

  const createNote = (content) => {
    return {
      content: content,
      date: new Date().toISOString(),
      important: Math.random() < 0.5
    }
  }

  const addNote = async (event) => {
    event.preventDefault()
    const note = createNote(newNote)
    try {
      // add newNote to the server    
      const newNote = await noteService.create(note)
      // add newNote into the array of notes if post was successful
      setNotes(notes.concat(newNote))
      // make the newNote variable empty so the user can type again
      setNewNote('')
      setSuccessNotification('Note added successfully!')
    } catch (exception) {
      // error message 
      console.log(exception)
      setFailureNotification(`Failed to add new note: ${exception}`)
    }
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

  const noteBelongsToUser = (note) => {
    if (user === null || user.id === null) {
      return false
    }

    console.log(user)
    console.log(note)

    return note.user === user.id
  }

  const toggleImportanceOf = async (id) => {
    const note = notes.find(n => n.id === id)
    if (note === undefined) {
      setFailureNotification('Could not update note!')
      return
    }

    if (!noteBelongsToUser(note)) {
      setFailureNotification('Cannot edit notes that belong to others!')
      return
    }

    // update note
    const changedNote = {...note, important: !note.important}
    try {
      const newNote = await noteService.update(id, changedNote)
      setNotes(notes.map(note => note.id === id ? newNote : note))
      setSuccessNotification('Note updated successfully!')
    } catch (exception) {
      console.log(exception)
      setFailureNotification(`Failed to update note: ${exception}`)
    }
  }
  

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username 
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password 
          <input
            type="text"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    )
  }
  
  const noteForm = () => {
    return (
      <>
        <div>
          <p>{user.username} logged-in</p>
        </div>
        <form onSubmit={addNote}>
          <input
            value={newNote}
            onChange={handleNoteChange}
          />
          <button type="submit">save</button>
        </form>
      </>
    )
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification notification={notification}/>
      
      {user === null ? loginForm() : noteForm()}

      <button onClick={handleShowAllToggle}>
        show {showAll ? "important" : "all"}
      </button>
      <ul>
        {notesToShow().map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
    </div>
  )
}

export default App