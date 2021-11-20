import React, { useState } from 'react'

const NoteForm = ({
  createNote
}) => {
  const [note, setNote] = useState('a new note...')

  const construct = (content) => {
    return {
      content: content,
      date: new Date().toISOString(),
      important: Math.random() < 0.5
    }
  }

  const addNote = async (event) => {
    event.preventDefault()
    await createNote(construct(note))
    setNote('')
  }

  return (
    <form onSubmit={addNote}>
      <input
        value={note}
        onChange={(event) => {setNote(event.target.value)}}
      />
      <button type="submit">save</button>
    </form>
  )
}

export default NoteForm