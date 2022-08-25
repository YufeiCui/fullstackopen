import noteReducer from './noteReducer'
import deepFreeze from 'deep-freeze'

describe('noteReducer', () => {
  test('returns new state with payload', () => {
    const state = []
    const action = {
      type: 'notes/createNote',
      payload: 'the app state is in redux store'
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)
    
    expect(newState).toHaveLength(1)
    expect(newState.map(s => s.content)).toContainEqual(action.payload)
  })

  test('returns new state with action TOGGLE_IMPORTANCE', () => {
    const note1 = {
      content: 'the app state is in redux store',
      important: true,
      id: 1
    }
    const note2 = {
      content: 'state changes are made with actions',
      important: false,
      id: 2
    }

    const action = {
      type: 'notes/toggleImportanceOf',
      payload: 2
    }

    const state = [note1, note2]
    deepFreeze(state)

    const newState = noteReducer(state, action)
    
    expect(newState).toHaveLength(2)
    expect(newState).toContainEqual(note1)
    expect(newState).toContainEqual({...note2, important: true})
  })
})