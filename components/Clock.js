import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Clock({timeLeft}) {
  //const [timeLeft, setTimeLeft] = useState(20);

  // useEffect(() => {
  //   if (timeLeft > 0) {
  //     const timer = setInterval(() => {
  //       setTimeLeft((prevTime) => prevTime - 1);
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }
  // }, [timeLeft]);

  const percentage = (timeLeft / 20) * 100;

  return (
    <div style={{ width: 100, height: 100, marginLeft: '20px' }}>
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}`}
        styles={buildStyles({
          rotation: 0,
          strokeLinecap: 'butt',
          textSize: '24px',
          pathTransitionDuration: 0.5,
          pathColor: `rgb(255,127,80)`,
          textColor: 'rgb(255,127,80)',
          trailColor: '#d6d6d6',
        })}
      />
    </div>
  );
}
