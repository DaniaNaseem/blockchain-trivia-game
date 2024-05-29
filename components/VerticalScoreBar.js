import React from 'react';
//background: ' #070A10',
const VerticalScoreBar = ({ score }) => {
  const containerStyle = {
    position: 'relative',
    height: '300px',
    width: '10px',
    background: 'darkred',
    borderRadius: '10px',
    overflow: 'hidden',
  };

  const progressBarStyle = {
    position: 'absolute',
    bottom: '0',
    height: `${score}%`,
    width: '100%',
    background: 'brightgreen',
  };

  const progressStyle = {
    height: '100%',
    width: '100%',
    background: 'darkgreen',
  };

  return (
    <div style={containerStyle}>
      <div style={progressBarStyle}>
        <div style={progressStyle}></div>
      </div>
    </div>
  );
};

export default VerticalScoreBar;
