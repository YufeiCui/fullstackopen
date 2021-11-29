import React, { useImperativeHandle, useState } from 'react'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  const prompt = () => {
    return (
      <div>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
    )
  }

  const content = () => {
   return (
    <div>
      {props.children}
      <button onClick={toggleVisibility}>cancel</button>
    </div>
   )
  }

  return (
    <div>
      <div style={hideWhenVisible}>{prompt()}</div>
      <div style={showWhenVisible}>{content()}</div>
    </div>
  )
})

export default Togglable