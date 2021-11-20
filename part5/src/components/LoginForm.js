import React, { useState } from 'react'

const LoginForm = ({ 
  handleLogin,
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    await handleLogin({username, password})
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
      <div>
        username 
        <input
          type="text"
          value={username}
          name="Username"
          onChange={(event) => {setUsername(event.target.value)}}
        />
      </div>
      <div>
        password 
        <input
          type="text"
          value={password}
          name="Password"
          onChange={(event) => {setPassword(event.target.value)}}
        />
      </div>
      <button type="submit">login</button>
    </form>
    </div>
  )
}

export default LoginForm