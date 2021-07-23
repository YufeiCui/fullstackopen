import React, { useState } from 'react'

const App = () => {
  // Free getter and setter!
  const [counter, setCounter] = useState(0)

  const increment = () => setCounter(counter + 1)
  const decrement = () => setCounter(counter - 1)
  const handleReset = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      <Button handleClick={increment} text="Plus"/>
      <Button handleClick={handleReset} text="Reset"/>
      <Button handleClick={decrement} text="Minus"/>
    </div>
  )
}

const Display = ({ counter }) => {
  return (
    <p>{counter}</p>
  )
}

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

export default App;
