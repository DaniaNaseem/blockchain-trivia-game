// components/SocketTest.js

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(`http://3.134.237.219:3001`);



const SocketTest = () => {
  const [message, setMessage] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    socket.on('hello', (message) => {
      setMessage(message);
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    socket.emit('hi', inputMessage);
    setInputMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div>
      <h1>Socket.io Test</h1>
      <p>{message}</p>
      <input
        type="text"
        placeholder="Type 'hi' and press Enter"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default SocketTest;
