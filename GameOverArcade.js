import React from 'react';
import Router from 'next/router';
import {useState, useEffect} from 'react'

async function postUserScore(score) {
  // Replace 'your_token_here' with the actual token from local storage
  const token = localStorage.getItem('user_detail_token');

  if (!token) {
    console.error('Token not found in local storage');
    return;
  }

  try {
    const response = await fetch('http://3.134.237.219:3000/api/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(
        { score: score,
        score_and_moves_hash:"scoreHash" 
      }),
    });

    if (response.ok) {
      console.log('Score posted successfully.');
      // You can add further actions or feedback for the user here.
    } else {
      console.error('Failed to post the score. Status:', response.text());
    }
  } catch (error) {
    console.error('Error while posting the score:', error);
  }
}

function goToHome() {
  Router.push('/');
}

function GameOver({ message, score }) {
  const [scorePosted, setScorePosted] = useState(false);
  // Call the postUserScore function when the component is rendered
  useEffect(() => {
    if (!scorePosted) {
      postUserScore(score);
      setScorePosted(true);
    }
  }, []);

  return (
    <div>
      <>
        <div className="flex-1 align-center bg-gray-900 p-16">
          <h2 className="text-gray-200 text-center text-5xl mb-10">{message}</h2>
          <h2 className="text-gray-200 text-center text-5xl mb-10">{score}</h2>

          {/* Center-aligned button */}
          <div className="text-center">
            <button className="bg-orange-500 text-white text-lg px-6 py-3 rounded-md hover:bg-orange-600" onClick={goToHome}>
              Play More
            </button>
          </div>
        </div>
      </>
    </div>
  );
}

export default GameOver;
