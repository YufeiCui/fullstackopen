import React from 'react'
import './Notification.css'

const Notification = ({ notification }) => {
  if (notification === null || notification.message === null) {
    return null
  }

  return (
    <div className={notification.isError ? 'error' : 'notification'}>
      {notification.message}
    </div>
  )
}

export default Notification