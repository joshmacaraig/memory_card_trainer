import React, { useState, useEffect } from 'react';
import ImageDisplay from './ImageDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './MetronomeControl.css';

const MetronomeControl = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [isPreparing, setIsPreparing] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [cardsToShow, setCardsToShow] = useState(1);
    const [seconds, setSeconds] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadedImageCount, setLoadedImageCount] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const totalCards = 52;
    const beatSound = new Audio('/sounds/metronome-85688.mp3');
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        const values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];

        let newImages = suits.flatMap(suit => 
            values.map(value => `/images/${value}_of_${suit}.png`)
        );

        newImages.sort(() => Math.random() - 0.5);

        newImages.forEach(imageSrc => {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                setLoadedImageCount(prevCount => prevCount + 1);
            };
        });

        setImages(newImages);
    }, []);

    useEffect(() => {
        if (loadedImageCount === totalCards) {
            setImagesLoaded(true);
        }
    }, [loadedImageCount]);

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
                        return prevIndex;
                    }
                });
            }, intervalTime);
        }
        return () => clearInterval(interval);
    }, [isRunning, seconds, cardsToShow, currentIndex, isMuted]);

    const handleStart = () => {
        setIsPreparing(true);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const totalTime = (totalCards / cardsToShow * seconds).toFixed(2);

    return (
        <div className="metronome-control">
            {!imagesLoaded && (
                <div>Loading images... {Math.round((loadedImageCount / totalCards) * 100)}%</div>
            )}

            {imagesLoaded && (
                <>
                    {isPreparing ? (
                        <div className="countdown">{countdown}</div>
                    ) : (
                        !isRunning && (
                            <button className="start-button" onClick={handleStart}>
                                Start
                            </button>
                        )
                    )}
                    {showImage && <ImageDisplay image={images[currentIndex]} />}
                </>
            )}

            <div onClick={toggleMute} className="mute-icon">
                <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
            </div>

            <div className="controls">
                <button onClick={handleStart}>Reset</button>
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
                    <span> - Total Time: {totalTime} seconds</span>
                </div>
            </div>
        </div>
    );
};

export default MetronomeControl;
