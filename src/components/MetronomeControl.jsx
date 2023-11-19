import React, { useState, useEffect } from 'react';
import ImageDisplay from './ImageDisplay';
import './MetronomeControl.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

const MetronomeControl = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [isPreparing, setIsPreparing] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [cardsToShow, setCardsToShow] = useState(1);
    const [seconds, setSeconds] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [showImage, setShowImage] = useState(false); // State to control image visibility
    const totalCards = 52;
    const beatSound = new Audio('/sounds/metronome-85688.mp3');
    const [isMuted, setIsMuted] = useState(false); // State for sound mute control

    useEffect(() => {
        // Generate and shuffle card images
        const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        const values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];

        let newImages = suits.flatMap(suit => 
            values.map(value => `${value}_of_${suit}.png`)
        );

        // Shuffle images
        newImages.sort(() => Math.random() - 0.5);
        setImages(newImages);
    }, []);

    useEffect(() => {
        if (isPreparing) {
            if (countdown > 0) {
                setTimeout(() => setCountdown(countdown - 1), 1000);
            } else {
                setShowImage(true);
                setIsRunning(true);
                setIsPreparing(false);
            }
        }
    }, [isPreparing, countdown]);

    useEffect(() => {
        let interval;
        if (isRunning && currentIndex < totalCards) {
            const intervalTime = (seconds * 1000) / cardsToShow;
            interval = setInterval(() => {
                setCurrentIndex(prevIndex => {
                    const newIndex = prevIndex + 1;
                    if (newIndex < totalCards) {
                        if (!isMuted) {
                            beatSound.play();
                        }
                        return newIndex;
                    } else {
                        setIsRunning(false);
                        setShowImage(false);
                        return prevIndex;
                    }
                });
            }, intervalTime);
        }
        return () => clearInterval(interval);
    }, [isRunning, seconds, cardsToShow, currentIndex, isMuted]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };


    const handleStart = () => {
        setIsPreparing(true);
    };

    const handleReset = () => {
        setCurrentIndex(0);
        setIsRunning(false);
        setShowImage(false);
        setCountdown(3);
    };

    const totalTime = (totalCards / cardsToShow * seconds).toFixed(2);

    return (
        <div className="metronome-control">
             <div onClick={toggleMute} className="mute-icon">
                {isMuted ? 
                    <FontAwesomeIcon icon={faVolumeMute} /> : 
                    <FontAwesomeIcon icon={faVolumeUp} />
                }
            </div>
            <div className='main-content'>
                {isPreparing ? 
                    <div className="countdown">{countdown}</div> : 
                    (!isRunning && <button className="start-button" onClick={handleStart}>Start</button>)
                }
                {showImage && <ImageDisplay image={images[currentIndex]} />}
                <div className="controls">
                    <button onClick={handleReset}>Reset</button>
                    <div>
                        <label>Cards: </label>
                        <input 
                            type="number" 
                            min="1" 
                            max="52" 
                            value={cardsToShow} 
                            onChange={(e) => setCardsToShow(parseInt(e.target.value, 10))} 
                        />
                        <label> Seconds: </label>
                        <input 
                            type="number" 
                            min="1" 
                            max="60" 
                            value={seconds} 
                            onChange={(e) => setSeconds(parseInt(e.target.value, 10))} 
                        />
                    </div>
                    <p>Total Time: {totalTime} seconds</p>
                </div>
            </div>
        </div>
    );
};

export default MetronomeControl;
