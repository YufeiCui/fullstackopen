import { useDispatch } from "react-redux"
import { createNote } from "../reducer/noteReducer"


const NewNote = () => {
  // hook for dispatching to the store in the Provider
  const dispatch = useDispatch()

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NewNote