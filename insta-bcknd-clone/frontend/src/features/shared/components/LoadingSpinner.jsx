import React from 'react'
import "./button.scss"

const LoadingSpinner = ({ size = 'medium' }) => {
    const sizeClass = size === 'small' ? 'spinner-small' : size === 'large' ? 'spinner-large' : 'spinner-medium'
    
    return (
        <div className={`loading-spinner ${sizeClass}`}>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
        </div>
    )
}

export default LoadingSpinner
