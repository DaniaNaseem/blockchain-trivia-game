import { useRouter } from 'next/router';
import React, { useState, useEffect } from "react";
import Navbar from '@/components/Navbar';
//import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import PracticeQuestionScreen from '@/components/QuizGamePracticeMode';
import ArcadeQuestionScreen from '@/components/QuizGameArcadeMode';
import MultiplayerQuestionScreen from '@/components/QuizGame1vs1';
import RoundScreen from '@/components/Round';
import EndScreen from '@/components/EndScreen';
import io from 'socket.io-client';


export default function Game() {
  const router = useRouter();
  const { topicName, quizMode } = router.query;
  const [topic, setTopic] = useState(null);
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsToLogin, setNeedsToLogin] = useState(false);
  const [status, setStatus] = useState(null);

  const [room, setRoom] = useState(null);
  const socket = io('http://3.134.237.219:3001');

  let backgroundMusic;

  useEffect(() => {
    // Start playing the background music when the component mounts
    if(typeof window !== 'undefined'){
      backgroundMusic = new Audio('/music/QuizUp-Battle.mp3');
      backgroundMusic.play();
    }

    // Stop the background music when the component unmounts
    return () => {
      backgroundMusic.pause();
    };
  }, []);

  useEffect(() => {
    // Listen for the 'hello' event emitted by the server
    socket.on('hello', (message) => {
      console.log("Server said hello");
      setLoading(false);
      console.log(message);
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const startQuiz = async () => {
      try {

        const token = localStorage.getItem('user_detail_token');

    if (!token) {
      // Handle the case where the token is not found in local storage
      setNeedsToLogin(true);
      setError('Token not found in local storage');
      return;
    }
      

        console.log("starting quiz");
        const data = {
          topicName,
          quizMode,
        };
        const response = await fetch(`http://3.134.237.219:3000/api/start-quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const {room_id, status} = await response.json();
          console.log(room_id);
          console.log(status);
          setRoom(room_id);
          setStatus(status);
        } else {
          setError('Error starting quiz');
        }
      } catch (error) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    if (topicName) {
      startQuiz();
    } else {
      setError('topicName is missing.');
    }
  }, [quizMode, topicName, router]);


  useEffect(() => {
    // Emit the 'startQuiz' event here with the room datax
    if(room){
      if(room.room_id){
        console.log("quiz Mode is");
        console.log(quizMode);
        if(quizMode=="Arcade Mode"){
          const room_id = room.room_id;
          socket.emit('startQuizArcade', JSON.stringify({room_id}));
        }
        else if (quizMode == "Practice Mode") {
          const room_id = room.room_id;
          socket.emit('startQuizPractice', JSON.stringify({room_id}));
        }
        else if (quizMode == "1 vs 1 Mode"){
          console.log("emiting start quiz event with");
          console.log(room_id);
          console.log(status);
          const room_id = room.room_id;
          socket.emit('startQuiz1vs1', JSON.stringify({room_id:room_id, status:status}));
        }
        else{

        }
      }
    }
  }, [room, status]);



  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  if (loading) {
    return <Loader />;
  }

  if (!topicName) {
    return <div>Topic not found.</div>;
  }




  

  return (
    <>
    <div className='black-background cover-screen'>
      {needsToLogin ? (
        <>
        <Navbar/>
        <h3>Please connect/reconnect wallet to play</h3>
        </>
      ) : (loading ? (
        <Loader />
      ) : (
        <>
          {quizMode === "Practice Mode" ? (
            <PracticeQuestionScreen socket={socket} />
          ) : (
            <>
              {quizMode === "Arcade Mode" ? (
                <ArcadeQuestionScreen socket={socket} />
              ) : (
                <>
                  {quizMode === "1 vs 1 Mode" ? (
                    <MultiplayerQuestionScreen socket={socket}/>
                  ) : (
                    <div>ERROR</div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )
      )}
    </div>
  </>
  );
}
