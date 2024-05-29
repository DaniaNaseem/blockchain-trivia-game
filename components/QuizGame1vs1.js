import React, { useState, useEffect } from 'react';
import User from '@/components/User';
import Clock from './Clock';
import VerticalScoreBar from '@/components/VerticalScoreBar';
import Round from './Round';
import GameOver from './GameOver1vs1';
import MatchMaking from './MatchMaking'

export default function QuizGame({socket, player}) {
  const initialTime = 20;
  const totalRounds = 10;

  const [answerData1,setAnswerData1] = useState(null);
  const [answerData2,setAnswerData2] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [clockEnded, setClockEnded] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);

  const [user1Answer, setUser1Answer] = useState('');
  const [user2Answer, setUser2Answer] = useState('')
  
  const [user1Score, setUser1Score] = useState(0);
  const [user2Score, setUser2Score] = useState(0);
  
  const [questionImage, setQuestionImage] = useState("/hero.jpg");
  const [timeToDisplayRoundScreen, setTimeToDisplayRoundScreen] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [gameOverScorePlayer1, setGameOverScorePlayer1] = useState(0);
  const [gameOverScorePlayer2, setGameOverScorePlayer2] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  



  useEffect(()=>{
    socket.on('readyForTimer', async(data) => {
      if(player == "player1"){
        socket.emit('startTimer', { room_id: data.room_id});
      }
    })
  },[socket])


  

  useEffect(() => {
    if(!isStarted){
      return;
    }
    setTimeLeft(initialTime);
  }, [currentRound, isStarted]);

  useEffect(() => {
    if(!isStarted){
      return;
    }
    if (timeLeft > 0 && !clockEnded) {
      // const timerTimeout = setTimeout(() => {
      //   setTimeLeft(prevTime => prevTime - 1);
      // }, 1000);
      // return () => clearTimeout(timerTimeout);
    } else if (timeLeft === 0 && !clockEnded) {
      setClockEnded(true);
      setTimeout(() => {
        if (currentRound < totalRounds) {
          setClockEnded(false);
          setCurrentRound(prevRound => prevRound + 1);
          setTimeLeft(initialTime);
          setUser1Answer('');
          setUser2Answer('');
        } else {
          console.log('Game over');
        }
      }, 3000);
    }
  }, [timeLeft, clockEnded, currentRound, isStarted]);

  const handleUser1Answer = (selectedAnswer) => {
    if(!isStarted){
      return;
    }
    console.log("room id in user input options");
    console.log(roomId);
    if (!user1Answer && !clockEnded && roomId) {
      setUser1Answer(selectedAnswer);
      console.log(selectedAnswer);
      socket.emit('optionSelected1vs1', { selectedOption: selectedAnswer, room_id: roomId, player:player });
      
    }
  };


  useEffect(() => {
    
    // Listen for the 'roundStart' event from the server
    socket.on('roundStart1vs1', (data) => {
      
      console.log("hahahahhaha")
      setIsStarted(true);
      setAnswerData1(null);
      setAnswerData2(null);
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
        setUser2Answer(null);
      }
    });
    return () => {
      socket.off('roundStart1vs1');
      // Add more event listeners if needed
    };
  }, [socket, isStarted]);




  useEffect(() => {
    if(!isStarted){
      return;
    }
    socket.on('answerChecked1vs1', (data) => {
      console.log("Answer checked");
      if (data && data.score && data.score_for_round && data.player_that_scored) {
        console.log("results are in");
        console.log(data);
        if(data.player_that_scored == "player1"){
          if (data.score === 0) {
            console.log("Answer was wrong");
            // Make selected answer option bg red and generate a wrong answer animation
            setAnswerData1(data.score_for_round);
          } else {
            console.log("Answer was right");
          
            setUser1Score(data.score);
            console.log("User score now");
            console.log(user1Score);
            setAnswerData1(data.score_for_round);
          }
        }
        else{
          if (data.score === 0) {
            console.log("Answer was wrong");
            // Make selected answer option bg red and generate a wrong answer animation
            setAnswerData2(data.score_for_round);
          }
          else {
            console.log("Answer was right");
          
            setUser2Score(data.score);
            console.log("User score now");
            console.log(user1Score);
            setAnswerData2(data.score_for_round);
          }
        }
      }
    })
    

    // Clean up event listeners when the component unmounts
    return () => {
      socket.off('answerChecked1vs1');
      // Add more event listeners if needed
    };
  }, [socket, isStarted]);

  useEffect(() => {
    if(!isStarted){
      return;
    }
    socket.on('gameOver1vs1', (data) => {
      console.log("game has ended");
      if (data && data.player1score && data.player2score && data.message) {
        console.log(data.message);
        console.log(data.player1score);
        console.log(data.player2score);

        setGameOverMessage(data.message);
        setGameOverScorePlayer1(data.player1score);
        setGameOverScorePlayer2(data.player2score);

        // Mark the game as over
        setIsGameOver(true);
        socket.disconnect();
      }
    })
    

    // Clean up event listeners when the component unmounts
    return () => {
      socket.off('gameOver1vs1');
      // Add more event listeners if needed
    };
  }, [socket, isStarted]);


  useEffect(() => {
    if(!isStarted){
      return;
    }
    socket.on('prepareForNextRound1vs1', (data) => {
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
            socket.emit('pleaseStartNextRound1vs1', { room_id: data.room_id, round: data.round });
            console.log("PleaseStartNextRound event emitted");
          }
        }, 2000);
      }
    });
  
    // Clean up event listener
    return () => {
      socket.off('prepareForNextRound1vs1');
    };
  }, [socket, isStarted]);


  useEffect(()=>{
    if(!isStarted){
      return;
    }
    socket.on('timerEvent1vs1', (data) => {
      console.log("Timer event received");
      if (data && data.timeLeft) {
        // Update the time left on the clock based on the data from the server
        setTimeLeft(data.timeLeft);
      }
    });
  
    // Clean up event listeners when the component unmounts
    return () => {
      socket.off('timerEvent1vs1');
      // Add more event listeners if needed
    };
  
  },[socket, isStarted])


  const handleUser2Answer = (selectedAnswer) => {
    if(!isStarted){
      return;
    }
    console.log("room id in user input options");
    console.log(roomId);
    if (!user2Answer && !clockEnded && roomId) {
      setUser2Answer(selectedAnswer);
      console.log(selectedAnswer);
      socket.emit('optionSelected1vs1', { selectedOption: selectedAnswer, room_id: roomId, player:player });
      
    }
  };



  return (
    <>
    {isStarted? (<div>
      {isGameOver ? (
      <>

      <div className="flex justify-between items-center pt-8 pl-28 pr-28 pb-8">
        <div className="flex space-x-4 m-4">
          <User userScore={user1Score}/>
        </div>
        
        <div className="flex space-x-4 m-4">
          <User userScore={user2Score}/>
        </div>
      </div>




      <div className="flex justify-between items-center px-36">
        <div className="flex space-x-4 m-4">
          <VerticalScoreBar score={user1Score} />
        </div>
        <div className="flex-1 align-center bg-gray-900 p-16 round-area">
          <GameOver message={gameOverMessage} score1={user1Score} score2={user2Score} player={player} />
        </div>
        <div className="flex space-x-4 m-4">
          <VerticalScoreBar score={user2Score} />
        </div>
      </div>
      </>
      ):(
    <div>
      <div className="flex justify-between items-center pt-8 pl-28 pr-28 pb-8">
        <div className="flex space-x-4 m-4">
          <User userScore={user1Score}/>
        </div>
        <div className="flex-1 flex justify-center">
          <Clock timeLeft={timeLeft}/>
        </div>
        <div className="flex space-x-4 m-4">
          <User userScore={user2Score}/>
        </div>
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
          <>
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
                      ? user1Answer === option && user1Answer !== "" && answerData1 && answerData1 > 0
                        ? "correct"
                        : "incorrect"
                      : "bg-white"
                  }`}
                  // onClick={() => handleUser1Answer(option)}
                >
                  {option}
                </div>
              ))
            ) : (
              <>
              {player == "player1"? (<>
                <div
                  className={`option-item text-black rounded-md p-2 text-center cursor-pointer ${
                    user1Answer === options[0]
                      ? user1Answer === options[0] && user1Answer !== "" && answerData1 && answerData1 > 0
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
                      ? user1Answer === options[1] && user1Answer !== "" && answerData1 && answerData1 > 0
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
                      ? user1Answer === options[2] && user1Answer !== "" && answerData1 && answerData1 > 0
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
                      ? user1Answer === options[3] && user1Answer !== "" && answerData1 && answerData1 > 0
                        ? "correct"
                        : "incorrect"
                      : "bg-white"
                  }`}
                  onClick={() => handleUser1Answer(options[3])}
                >
                  {options[3]}
                </div>
              </>):(<>
              
                <div
                  className={`option-item text-black rounded-md p-2 text-center cursor-pointer ${
                    user2Answer === options[0]
                      ? user2Answer === options[0] && user2Answer !== "" && answerData2 && answerData2 > 0
                        ? "correct"
                        : "incorrect"
                      : "bg-white"
                  }`}
                  onClick={() => handleUser2Answer(options[0])}
                >
                  {options[0]}
                </div>
                <div
                  className={`option-item text-black rounded-md p-2 text-center cursor-pointer ${
                    user2Answer === options[1]
                      ? user2Answer === options[1] && user2Answer !== "" && answerData2 && answerData2 > 0
                        ? "correct"
                        : "incorrect"
                      : "bg-white"
                  }`}
                  onClick={() => handleUser2Answer(options[1])}
                >
                  {options[1]}
                </div>
                <div
                  className={`option-item text-black rounded-md p-2 text-center cursor-pointer ${
                    user2Answer === options[2]
                      ? user2Answer === options[2] && user2Answer !== "" && answerData2 && answerData2 > 0
                        ? "correct"
                        : "incorrect"
                      : "bg-white"
                  }`}
                  onClick={() => handleUser2Answer(options[2])}
                >
                  {options[2]}
                </div>
                <div
                  className={`option-item text-black rounded-md p-2 text-center cursor-pointer ${
                    user2Answer === options[3]
                      ? user2Answer === options[3] && user2Answer !== "" && answerData2 && answerData2 > 0
                        ? "correct"
                        : "incorrect"
                      : "bg-white"
                  }`}
                  onClick={() => handleUser2Answer(options[3])}
                >
                  {options[3]}
                </div>
              
              
              </>)
              }
              </>
            )}
              </div>
            </div>
          </>
        )}
        <div className="flex space-x-4 m-4">
          <VerticalScoreBar score={user2Score} />
        </div>
      </div>
    </div>
      )}
    </div>):(<div>
      <MatchMaking/>
    </div>)}
    
    </>
  );
}
