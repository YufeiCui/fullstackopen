import React from 'react'

const NoteForm = ({
  onSubmit,
  note,
  handleNoteChange
}) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        value={note}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
    </form>
  )
}

export default NoteForm