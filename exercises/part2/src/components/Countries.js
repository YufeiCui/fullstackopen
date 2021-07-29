import React, { useEffect, useState } from 'react'
import Text from './Text'
import './Countries.css'
import axios from 'axios'

const Countries = ({ countries }) => {
  const [filterString, setFilterString] = useState('')

  const onFilterStringChange = (event) => {
    setFilterString(event.target.value)
  }

  const displayedCountries = countries.filter(country => {
    return country.name.toLowerCase().includes(filterString.toLowerCase())
  })

  return (
    <div>
      <Filter filterString={filterString} onChange={onFilterStringChange} />
      <RenderCountries countries={displayedCountries} />
    </div>
  )
}

const RenderCountries = ({ countries }) => {
  const count = countries.length
  // give detailed description if exactly 1
  if (count === 1) {
    return (
      <SpecificCountry country={countries[0]} />
    )
  } else if (count > 10) {
    return (
      <Text text="too many matches, specify another filter" />
    )
  } else {
    return (
      <CountryList countryList={countries} />
    )
  }
}

const Filter = ({ filterString, onChange }) => {
  return (
    <div>find countries <input value={filterString} onChange={onChange} /></div>
  )
}

const CountryList = ({ countryList }) => {
  return (
    countryList.map(country => {
      return <Country key={country.numericCode} country={country} />
    })
  )
}

const Country = ({ country }) => {
  return (
    <div>{country.name}</div>
  )
}

const SpecificCountry = ({ country }) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <div>Capital: {country.capital}</div>
      <div>Population: {country.population}</div>
      <Languages languages={country.languages}/>
      <Flag flag={country.flag} alt={country.name}/>
      <Weather city={country.capital}/>
    </div>
  )
}

const Languages = ({ languages }) => {
  return (
    <div>
      <h3>Languages</h3>
      <ul>
        {languages.map(language => {
          return <li key={language.name}>{language.name}</li>
        })}
      </ul>
    </div>
  )
}

const Flag = ({ flag, alt }) => {
  return (
    <img className="flag" src={flag} alt={alt} />
  )
}

const access_key = process.env.REACT_APP_WEATHER_API_KEY
const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)

  const hook = () => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${access_key}&query=${city}&units=m`)
      .then(response => {
        setWeather(response.data.current)
      })
  }

  useEffect(hook, [city])

  return (
    <div>
      <h3>Weather in {city} </h3>
      {weather !== null &&
        <div>
          <div>Temperature: {weather.temperature} Celcius</div>
          <img src={weather.weather_icons[0]} alt={city}/>
          <div>Wind: {weather.wind_speed} km/h direction {weather.wind_dir}</div>
        </div>
      }
    </div>
  )
}

export default Countries