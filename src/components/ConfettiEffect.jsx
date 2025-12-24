import React, { useEffect } from 'react';
import Confetti from 'react-confetti-boom';

const ConfettiEffect = ({ show }) => {
    if (!show) return null;

    return (
        <Confetti
            mode="boom"
            particleCount={150}
            colors={['#BA0C2F', '#002D72', '#FFD700', '#228B22', '#FFA500']}
            shapeSize={20}
            spreadDeg={360}
            effectInterval={2000}
            effectCount={3}
            x={0.5}
            y={0.5}
        />
    );
};

export default ConfettiEffect;