import { useDispatch, useSelector } from "react-redux"
import { incrementVoteFor } from "../reducers/anecdoteReducer"

const AnecdoteList = () => {
  const sortByVotes = (state) => {
    return state.sort((a, b) => b.votes - a.votes)
  }
  const anecdotes = useSelector(sortByVotes)
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(incrementVoteFor(id))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList