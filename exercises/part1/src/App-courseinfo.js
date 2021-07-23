import React from 'react'

const Header = (props) => {
  return (
    <div>{props.course}</div>
  )
}

const Part = (props) => {
  return (
    <p>{props.part} {props.exercise}</p>
  )
}

const Content = (props) => {
  return (
    props.content.map((part) => {
      return <Part part={part.name} exercise={part.exercises}/>
    })
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises: {props.total}</p>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  // returns the total number of exercises given a list of parts 
  const getTotalExercises = content => {
    return content.reduce((acc, curr) => acc + curr.exercises, 0)
  }

  return (
    <div>
      <Header course={course.name}/>
      <Content content={course.parts}/>
      <Total total={getTotalExercises(course.parts)}/>
    </div>
  )
}

export default App;