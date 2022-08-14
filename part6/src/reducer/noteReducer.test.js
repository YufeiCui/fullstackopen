import noteReducer from './noteReducer'
import deepFreeze from 'deep-freeze'

describe('noteReducer', () => {
  test('returns new state with action NEW_NOTE', () => {
    const state = []
    const action = {
      type: 'NEW_NOTE',
      data: {
        content: 'some text',
        important: true,
        id: 1
      }
    }


    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toContainEqual(action.data)
    expect(newState).toHaveLength(1)
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
      type: 'TOGGLE_IMPORTANCE',
      data: {
        id: 2
      }
    }

    const newState = noteReducer([note1, note2], action)
    expect(newState).toHaveLength(2)
    expect(newState).toContainEqual(note1)
    expect(newState).toContainEqual({...note2, important: true})
  })
})