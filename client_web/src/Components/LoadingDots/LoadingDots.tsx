import React from 'react';
import './LoadingDots.css';

interface LoadingDotsProps {
    color?: string;
    size?: number;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ 
    color = '#000000', 
    size = 4 
}) => {
    return (
        <span className="loading-dots">
            <span 
                className="dot" 
                style={{ 
                    backgroundColor: color,
                    width: size,
                    height: size,
                    margin: size / 2
                }}
            />
            <span 
                className="dot" 
                style={{ 
                    backgroundColor: color,
                    width: size,
                    height: size,
                    margin: size / 2
                }}
            />
            <span 
                className="dot" 
                style={{ 
                    backgroundColor: color,
                    width: size,
                    height: size,
                    margin: size / 2
                }}
            />
        </span>
    );
};

export default LoadingDots; 