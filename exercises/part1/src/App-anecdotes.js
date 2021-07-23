import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))

  const selectAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const voteAnecdote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  return (
    <div>
      <Header text="Anecdote of the day"/>
      <Anecdote anecdote={anecdotes[selected]} votes={points[selected]}/>
      <Button handler={voteAnecdote} text="vote" />
      <Button handler={selectAnecdote} text="next anecdote" />
      <Header text="Anecdote with the most votes"/>
      <MostVotedAnecdote anecdotes={anecdotes} votes={points}/>
    </div>
  )
}

const Anecdote = ({ anecdote, votes }) => {
  return (
    <div>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </div>
  )
}

const MostVotedAnecdote = ({ anecdotes, votes}) => {
  const maxIndex = votes.indexOf(Math.max(...votes))
  return (
    <Anecdote anecdote={anecdotes[maxIndex]} votes={votes[maxIndex]}/>
  )
}

const Button = ({ handler, text }) => {
  return (
    <button onClick={handler}>
      {text}
    </button>
  )
}

const Header = ({ text }) => {
  return (
    <h1>{text}</h1>
  )
}

export default App;