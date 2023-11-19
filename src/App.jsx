import React, { useState, useEffect } from 'react';
// import ImageDisplay from './components/ImageDisplay';
import MetronomeControl from './components/MetronomeControl';

const App = () => {
    const [currentImage, setCurrentImage] = useState('');

    return (
        <div>
            {/* <ImageDisplay image={currentImage} /> */}
            <MetronomeControl setCurrentImage={setCurrentImage} />
        </div>
    );
};

export default App;
