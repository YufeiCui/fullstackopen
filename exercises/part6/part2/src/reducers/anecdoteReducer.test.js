import deepFreeze from 'deep-freeze'
import reducer from './anecdoteReducer'

describe("anecdoteReducer", () => {
  test("increments votes", () => {
    const first = {
      content: "hello",
      id: 1,
      votes: 0
    }
    const second = {
      content: "byebye",
      id: 2,
      votes: 2
    }
    const state = [first, second]
    const action = {
      type: 'INCREMENT',
      id: 2
    }

    deepFreeze(state)
    const newState = reducer(state, action)

    expect(newState).toHaveLength(2)
    expect(newState).toContainEqual(first)
    expect(newState).toContainEqual({ ...second, votes: second.votes + 1 })
  })
})
