import React, { useState } from 'react'

const App = () => {
    const [left, setLeft] = useState(0)
    const [right, setright] = useState(0)
    const [allClicks, setAll] = useState([])

    const handleLeft = () => {
        setLeft(left + 1)
        setAll(allClicks.concat('L'))
    }

    const handleRight = () => {
        setright(right + 1)
        setAll(allClicks.concat('R'))
    }

    return (
        <div>
            {left}
            <Button handler={handleLeft} text="left"/>
            <Button handler={handleRight} text="right"/>
            {right}
            <History allClicks={allClicks}/>
        </div>
    )
}

const Button = ({ handler, text }) => {
    return (
        <button onClick={handler}>
            {text}
        </button>
    )
}

const History = ( {allClicks }) => {
    let content;
    if (allClicks.length === 0) {
        content = "the app is used by pressing the buttons"
    } else {
        content = `button press history: ${allClicks.join(' ')}`
    }

    return (<div>{content}</div>)
}

export default App;