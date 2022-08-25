import { useDispatch, useSelector } from "react-redux"
import Filter from "../filterTypes"
import { toggleImportanceOf } from "../reducer/noteReducer"

const Notes = () => {
  // hook for dispatching to the store in the Provider
  const dispatch = useDispatch()
  // hook for extracting info from the store
  const notes = useSelector(state => filterNotesBy(state.notes, state.filter))

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id))
  }

  return (
    <ul>
      {notes.map(note =>
        <Note
          note={note}
          handleClick={() => toggleImportance(note.id)} />
      )}
    </ul>
  )
}

const Note = ({ note, handleClick }) => {
  return (
    <li
      key={note.id}
      onClick={handleClick}
    >
      {note.content} <strong>{note.important ? 'important' : ''}</strong>
    </li>
  )
}

const filterNotesBy = (notes, filter) => {
  switch (filter) {
    case Filter.ALL:
      return notes
    case Filter.IMPORTANT:
      return notes.filter(note => note.important)
    case Filter.NONIMPORTANT:
      return notes.filter(note => !note.important)
    default:
      return notes
  }
}

export default Notes