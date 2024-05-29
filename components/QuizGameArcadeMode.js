

import React, { useState, useEffect } from 'react';
import User from '@/components/User';
import Clock from './Clock';
import VerticalScoreBar from '@/components/VerticalScoreBar';
import Round from './Round';
import GameOver from './GameOverArcade';

export default function ArcadeQuestionScreen({ socket }) {
  const initialTime = 20;
  const totalRounds = 10;

  const [answerData,setAnswerData] = useState(null);

  const [roomId, setRoomId] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [clockEnded, setClockEnded] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [user1Answer, setUser1Answer] = useState('');
  const [user1Score, setUser1Score] = useState(0);
  const [questionImage, setQuestionImage] = useState("/hero.jpg");
  const [timeToDisplayRoundScreen, setTimeToDisplayRoundScreen] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [gameOverScore, setGameOverScore] = useState(0);


  // Example using inline styles (you can use your preferred CSS approach)


  useEffect(() => {
    setTimeLeft(initialTime);
  }, [currentRound]);

  useEffect(() => {
    if (timeLeft > 0 && !clockEnded) {
      const timerTimeout = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timerTimeout);
    } else if (timeLeft === 0 && !clockEnded) {
      setClockEnded(true);
      setTimeout(() => {
        if (currentRound < totalRounds) {
          setClockEnded(false);
          setCurrentRound(prevRound => prevRound + 1);
          setTimeLeft(initialTime);
          setUser1Answer('');
        } else {
          console.log('Game over');
        }
      }, 3000);
    }
  }, [timeLeft, clockEnded, currentRound]);

  const handleUser1Answer = (selectedAnswer) => {
    console.log("room id in user input options");
    console.log(roomId);
    if (!user1Answer && !clockEnded && roomId) {
      setUser1Answer(selectedAnswer);
      console.log(selectedAnswer);
      socket.emit('optionSelectedArcade', { selectedOption: selectedAnswer, room_id: roomId });
      
    }
  };

  // Add event listeners for Socket.io events
  useEffect(() => {
    // Listen for the 'roundStart' event from the server
    socket.on('roundStartArcade', (data) => {
      setAnswerData(null);
      setTimeToDisplayRoundScreen(false);
      console.log("rounder started");
      if (data && data.question) {
        console.log(data);
        console.log("roomId initially in state");
        console.log(roomId);
        
        console.log("room id recieved from server");
        console.log(data.room_id);
        setRoomId(data.room_id);
        
        console.log("roomId after being set");
        console.log(roomId);
        setTimeLeft(data.timer);
        setQuestion(data.question.question);
        setOptions(data.question.options);
        setCurrentRound(data.roundNumber);
        setQuestionImage(data.question.image_url);
        setUser1Answer(null);
      }
    });
    return () => {
      socket.off('roundStartArcade');
      // Add more event listeners if needed
    };
  }, [socket]);

  useEffect(() => {
    socket.on('answerCheckedArcade', (data) => {
      console.log("Answer checked");
      if (data && data.score) {
        console.log("results are in");
        console.log(data);
        if (data.score === 0) {
          console.log("Answer was wrong");
          // Make selected answer option bg red and generate a wrong answer animation
          setAnswerData(data.score_for_round);
        } else {
          console.log("Answer was right");
          setUser1Score(data.score);
          console.log("User score now");
          console.log(user1Score);
          setAnswerData(data.score_for_round);
        }
      }
    })
    

    // Clean up event listeners when the component unmounts
    return () => {
      socket.off('answerCheckedArcade');
      // Add more event listeners if needed
    };
  }, [socket]);

  useEffect(() => {
    socket.on('gameOverArcade', (data) => {
      console.log("game has ended");
      if (data && data.score && data.message) {
        console.log(data.message);
        console.log(data.score);

        setGameOverMessage(data.message);
        setGameOverScore(data.score);

        // Mark the game as over
        setIsGameOver(true);
        socket.disconnect();
      }
    })
    

    // Clean up event listeners when the component unmounts
    return () => {
      socket.off('gameOverArcade');
      // Add more event listeners if needed
    };
  }, [socket]);


  useEffect(() => {
    socket.on('prepareForNextRoundArcade', (data) => {
      console.log("prepareForNextRound event recieved");
      if (data && data.round) {
        setCurrentRound(data.round);
        setTimeToDisplayRoundScreen(true);

        setTimeout(() => {
          console.log("maybe going to emit pleaseStartNextRound");
          console.log(roomId);
          console.log(data.round);
          if (data && data.room_id && data.round) {
            console.log("definitely going to IA emit pleaseStartNextRound");
            socket.emit('pleaseStartNextRoundArcade', { room_id: data.room_id, round: data.round });
            console.log("PleaseStartNextRound event emitted");
          }
        }, 2000);
      }
    });
  
    // Clean up event listener
    return () => {
      socket.off('prepareForNextRoundArcade');
    };
  }, [socket]);


  useEffect(()=>{
    socket.on('timerEventArcade', (data) => {
      console.log("Timer event received");
      if (data && data.timeLeft) {
        // Update the time left on the clock based on the data from the server
        setTimeLeft(data.timeLeft);
      }
    });
  
    // Clean up event listeners when the component unmounts
    return () => {
      socket.off('timerEventArcade');
      // Add more event listeners if needed
    };
  
  },[socket])


  return (
    <div>
      {isGameOver ? (
        <div>
          <div className="flex justify-between items-center pt-8 pl-28 pr-28 pb-8">
            <div className="flex space-x-4 m-4">
              <User userScore={user1Score} />
            </div>
          </div>

          <div className="flex justify-between items-center px-36">
          <div className="flex space-x-4 m-4">
              <VerticalScoreBar score={user1Score} />
            </div>
          <div className="flex-1 align-center bg-gray-900 p-16">
        <GameOver message={gameOverMessage} score={user1Score} />
        </div>
        </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center pt-8 pl-28 pr-28 pb-8">
            <div className="flex space-x-4 m-4">
              <User userScore={user1Score} />
            </div>
            {timeToDisplayRoundScreen? (<></>):(
            <div className="flex-1 flex justify-center items-center">
              <Clock timeLeft={timeLeft} />
            </div>
            )}
          </div>
  
          <div className="flex justify-between items-center px-36">
            <div className="flex space-x-4 m-4">
              <VerticalScoreBar score={user1Score} />
            </div>
            {clockEnded || timeToDisplayRoundScreen ? (
              <div className="flex-1 align-center bg-gray-900 p-16 round-area">
                <Round number={currentRound} />
              </div>
            ) : (
              <div className="flex-1 align-center bg-gray-900 p-16 question-area">
                <div className="center-image">
                  <img
                    src={questionImage}
                    alt="Image Alt Text"
                    className="mb-4 max-w-full"
                  />
                </div>
                <h2 className="text-gray-200 text-center text-3xl mb-4">{question}</h2>
                <div className="options grid gap-8 md:grid-cols-2">
                  {options.length === 0 ? (
                    options.map((option, index) => (
                      <div
                        key={index}
                        className={`option-item text-black rounded-md p-2 text-center cursor-pointer ${
                          user1Answer === option
                            ? user1Answer === option && user1Answer !== "" && answerData && answerData > 0
                              ? "correct"
                              : "incorrect"
                            : "bg-white"
                        }`}
                        onClick={() => handleUser1Answer(option)}
                      >
                        {option}
                      </div>
                    ))
                  ) : (
                    <>
                      <div
                        className={`option-item text-black rounded-md p-2 text-center cursor-pointer ${
                          user1Answer === options[0]
                            ? user1Answer === options[0] && user1Answer !== "" && answerData && answerData > 0
                              ? "correct"
                              : "incorrect"
                            : "bg-white"
                        }`}
                        onClick={() => handleUser1Answer(options[0])}
                      >
                        {options[0]}
                      </div>
                      <div
                        className={`option-item text-black rounded-md p-2 text-center cursor-pointer ${
                          user1Answer === options[1]
                            ? user1Answer === options[1] && user1Answer !== "" && answerData && answerData > 0
                              ? "correct"
                              : "incorrect"
                            : "bg-white"
                        }`}
                        onClick={() => handleUser1Answer(options[1])}
                      >
                        {options[1]}
                      </div>
                      <div
                        className={`option-item text-black rounded-md p-2 text-center cursor-pointer ${
                          user1Answer === options[2]
                            ? user1Answer === options[2] && user1Answer !== "" && answerData && answerData > 0
                              ? "correct"
                              : "incorrect"
                            : "bg-white"
                        }`}
                        onClick={() => handleUser1Answer(options[2])}
                      >
                        {options[2]}
                      </div>
                      <div
                        className={`option-item text-black rounded-md p-2 text-center cursor-pointer ${
                          user1Answer === options[3]
                            ? user1Answer === options[3] && user1Answer !== "" && answerData && answerData > 0
                              ? "correct"
                              : "incorrect"
                            : "bg-white"
                        }`}
                        onClick={() => handleUser1Answer(options[3])}
                      >
                        {options[3]}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );  
}
