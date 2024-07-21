import React, { useState, useEffect } from 'react';
import './LoadingBar.css';

function LoadingBar() {
    const fixedDurationInSeconds = 0.4; 

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('Animation completed');
        }, fixedDurationInSeconds * 1000);

        return () => clearTimeout(timer);
    }, [fixedDurationInSeconds]);

    return (
        <div className="loading-bar-container mx-auto mt-10">
            <div className="loading-bar" style={{ animationDuration: `${fixedDurationInSeconds}s` }}></div>
        </div>
    );
}

export default LoadingBar;
