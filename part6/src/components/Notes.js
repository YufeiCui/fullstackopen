import { useDispatch, useSelector } from "react-redux"
import { toggleImportanceOf } from "../reducer/noteReducer"

const Notes = () => {
  // hook for dispatching to the store in the Provider
  const dispatch = useDispatch()
  // hook for extracting info from the store
  const notes = useSelector(state => state)

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

export default Notes