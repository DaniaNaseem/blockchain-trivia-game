import TopicDetailsComponent from '@/components/Topic-Details'
import { useRouter } from 'next/router';
import React, {useState, useEffect} from "react";
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

import Loader from '@/components/Loader'

export default function TopicDetails(){
    //const token=process.env.NEXT_PUBLIC_TOKEN

    const router = useRouter();
    console.log(router.query);
    const { topicName } = router.query;
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchTopicData = async () => {
        try {
          const response = await fetch(`http://3.134.237.219:3000/api/topic-details?topicName=${topicName}`);
  
          if (response.ok) {
            const fetchedTopic = await response.json();
            setTopic(fetchedTopic);
          } else {
            // Handle error here, set error state
            setError('Error fetching topic data');
          }
        } catch (error) {
          // Handle network errors
          setError('Network error');
        } finally {
          // Set loading to false when the request is complete
          setLoading(false);
        }
      };
  
      if (topicName) {
        fetchTopicData();
      } else {
        // topicName is not available, handle this case accordingly
        setError('topicName is missing.');
      }
    }, [topicName, router]);
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    if (loading) {
      return <Loader/>;
    }
  
    if (!topic) {
      return <div>Topic not found.</div>;
    }

    const handleModeSelection = (mode) => {
      // Use router.push to navigate to the quiz page with topicName and selected mode as query parameters
      router.push({
        pathname: '/game', // Specify the path to the quiz page
        query: { topicName, quizMode: mode },
      });
    };

    return (
        <>
        <Navbar/>
        <section className="text-gray-700 body-font overflow-hidden bg-white" id="content">
        <div className="container px-5 py-5 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img alt={topic.topic_name} className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200" src={topic.image_url}></img>
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">{topic.category}</h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{topic.topic_name}</h1>
              <div className="flex mb-4">
                
                
              </div>
              <p className="leading-relaxed">{topic.description}</p>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
              </div>
              <div className="flex">
          <button
            className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
            onClick={() => handleModeSelection('Practice Mode')}
          >
            Practice Mode
          </button>
          <button
            className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover-bg-red-600 rounded"
            onClick={() => handleModeSelection('Arcade Mode')}
          >
            Arcade Mode
          </button>
          <button
            className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover-bg-red-600 rounded"
            onClick={() => handleModeSelection('1 vs 1 Mode')}
          >
            1 vs 1
          </button>
        </div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
      </>
    );
    }