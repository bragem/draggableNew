import React from 'react'

const Pause = ({ onPlayerClick }) => {
    return (
        <svg className="button" viewBox="0 0 40 40" onClick={onPlayerClick}>
            <polygon points="0,0 7,0 7,40 0,40" />
            <polygon points="1,0 20,0 40,40 12,40" />
        </svg>
    )
}

export default Pause