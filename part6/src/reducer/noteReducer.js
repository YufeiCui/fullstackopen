const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    return [...state, action.data]
  }
  
  if (action.type === 'TOGGLE_IMPORTANCE') {
    return state.map(note => toggleImportanceForId(note, action.data.id)) 
  }

  return state
}

const toggleImportanceForId = (note, id) => {
  if (note.id !== id) {
    return note
  }
  
  return {...note, important: !note.important}
}

export default noteReducer