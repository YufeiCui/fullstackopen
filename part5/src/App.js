import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

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
  
  // use effect to retrieve user information from localstorage
  useEffect(() => {
    const noteAppUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (noteAppUserJSON) {
      const user = JSON.parse(noteAppUserJSON)
      setUserInfo(user)
    }
  }, [])

  const setUserInfo = (user) => {
    setUser(user)
    noteService.setToken(user.token)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )
      setUserInfo(user)
      setUsername('')
      setPassword('')
      setSuccessNotification(`${user.username} has successfully signed in!`)
    } catch (exception) {
      // error message 
      console.log(exception)
      setFailureNotification(`Sign in failed: ${exception}`)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedNoteAppUser')
    setUser(null)
    setUsername('')
    setPassword('')
    setSuccessNotification('User successfully logged out!')
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

    return note.user === user.id
  }

  const toggleImportanceOf = async (id) => {
    const oldNote = notes.find(n => n.id === id)
    if (oldNote === undefined) {
      setFailureNotification('Could not update note!')
      return
    }

    if (!noteBelongsToUser(oldNote)) {
      setFailureNotification('Cannot edit notes that belongs to others!')
      return
    }

    // update note
    const changedNote = {...oldNote, important: !oldNote.important}
    try {
      // improve performance by preemptively changing the UI 
      setNotes(notes.map(note => note.id === id ? changedNote : note))
      await noteService.update(id, changedNote)
      setSuccessNotification('Note updated successfully!')
    } catch (exception) {
      setNotes(notes.map(note => note.id === id ? oldNote : note))
      console.log(exception)
      setFailureNotification(`Failed to update note: ${exception}`)
    }
  }
  
  const noteForm = () => {
    return (
      <>
        <div>
          <p>{user.username} logged-in</p>
          <button onClick={handleLogout}>
            logout
          </button>
        </div>
        <Togglable buttonLabel="new note">
          <NoteForm 
            onSubmit={addNote}
            note={newNote}
            handleNoteChange={handleNoteChange}
          />
        </Togglable>
      </>
    )
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel="Login">
        <LoginForm 
          handleSubmit={handleLogin} 
          handleUsernameChange={(event) => setUsername(event.target.value)}
          handlePasswordChange={(event) => setPassword(event.target.value)}
          username={username}
          password={password}
        />
      </Togglable>
    )
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification notification={notification}/>
      
      { user === null ? loginForm() : noteForm() }

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