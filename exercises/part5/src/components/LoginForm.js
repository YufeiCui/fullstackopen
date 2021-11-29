import React, { useState } from "react";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    await handleLogin({username, password})
    setUsername('')
    setPassword('')
  }

  return (
    <div>
     <div>
       <h2>Log in to blog application</h2>
     </div>
     <form onSubmit={onSubmit}>
       <div>
         username: 
         <input 
           type="text" 
           value={username} 
           onChange={ (event) => setUsername(event.target.value) }
         />
       </div>
       <div>
         password: 
         <input 
           type="text" 
           value={password}
           onChange={ (event) => {setPassword(event.target.value)} }
         />
       </div>
       <button type="submit">login</button>
     </form>
   </div>
   )
}

export default LoginForm