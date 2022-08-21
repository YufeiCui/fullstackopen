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

const generateId = () => Number(Math.random() * 1000000).toFixed(0)

export const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: {
      id
    }
  }
}

export default noteReducer