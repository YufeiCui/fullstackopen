import React, { useEffect, useState } from 'react'
import Countries from './components/Countries'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])

  const hook = () => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
    })
  }

  useEffect(hook,[])

  return (
    <Countries countries={countries}/>
  )
}

export default App
