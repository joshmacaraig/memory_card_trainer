import React from 'react';

const ImageDisplay = ({ image }) => {
    return (
        <div>
            {image && <img src={`/images/${image}`} alt="Card" style={{ maxWidth: '100%', height: 'auto' }} />}
        </div>
    );
};

export default ImageDisplay;
