import React from 'react'

const Course = ({ course }) => {

  // returns the total number of exercises given a list of parts
  const getTotalExercises = content => {
    return content.reduce((acc, curr) => acc + curr.exercises, 0)
  }

  return (
    <div>
      <Header course={course.name} />
      <Content content={course.parts} />
      <Total total={getTotalExercises(course.parts)} />
    </div>
  )
}

const Header = (props) => {
  return (
    <h2>{props.course}</h2>
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
      return <Part key={part.id} part={part.name} exercise={part.exercises}/>
    })
  )
}

const Total = (props) => {
  return (
    <p className="total">Total of {props.total} exercises</p>
  )
}


export default Course