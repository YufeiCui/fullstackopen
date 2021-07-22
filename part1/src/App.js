import React from 'react'

const Hello = (props) => (
  <p>Hello World, {props.name} who was borned on {props.age.toString()}</p>
)

const App = () =>{
  const now = new Date()
  const age = new Date(1997, 7-1, 7)

  return (
    <div>
      <p><Hello name="Yufei" age={age}/> it is now {now.toString()}</p>
    </div>
  )
}

export default App;
