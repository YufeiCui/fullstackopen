import React, { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeural] = useState(0)
  const [bad, setBad] = useState(0)

  // accepts a state and its setter and returns a function that increments its value
  const updateHandler = (val, valSetter) => {
    return () => {
      valSetter(val + 1)
    }
  }

  const getTotal = () => {
    return good + neutral + bad
  }

  const getAverage = () => {
    return (good - bad) / getTotal()
  }

  const getPositive = () => {
    return good / getTotal()
  }

  const percentage = (decimal) => {
    return (decimal * 100) + '%'
  }

  const hasFeedback = () => {
    return getTotal() !== 0
  }

  const unicafe = {
    "header": "Give Feedback",
    "statistics": "Statistics",
    "hasFeedback": hasFeedback(),
    stats: [
      {
        name: "good",
        val: good,
      },
      {
        name: "neutral",
        val: neutral,
      },
      {
        name: "bad",
        val: bad,
      },
      {
        name: "total",
        val: getTotal()
      },
      {
        name: "average",
        val: getAverage()
      },
      {
        name: "positive",
        val: percentage(getPositive())
      }
    ]
  }

  return (
    <div>
      <H1 text={unicafe.header}/>
      <Button handler={updateHandler(good, setGood)} text="Good"/>
      <Button handler={updateHandler(neutral, setNeural)} text="Neutral"/>
      <Button handler={updateHandler(bad, setBad)} text="Bad"/>
      <H1 text={unicafe.statistics}/>
      <Statistics data={unicafe}/>
    </div>
  )
}

const H1 = ({ text }) => {
  return (
    <h1>{text}</h1>
  )
}

const Button = ({ handler, text })  => {
  return (
    <button onClick={handler}>
      {text}
    </button>
  )
}

const Statistic = ({ count, text }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{count}</td>
    </tr>
  )
}

const Statistics = ({ data }) => {
  if (!data.hasFeedback) {
    return (
      <p>No feedback given.</p>
    )
  }

  const entries = data.stats.map(info =>  {
    return <Statistic text={info.name} count={info.val}/>
  })

  return (
    <table>
      {entries}
    </table>
  )
}

export default App;