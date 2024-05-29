import React, { useState, useEffect } from 'react';
import Link from 'next/link';

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');

  const itemsToShow = 6;

  async function fetchTopics() {
    try {
      const response = await fetch(`http://3.134.237.219:3000/api/topics`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const historyTopics = data.filter(item => item.category === "History");

      setTopics(historyTopics);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    fetchTopics();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

   // Create a circular buffer of topics to ensure consistent itemsToShow
   const circularBuffer = [...topics, ...topics, ...topics];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - itemsToShow;
      return newIndex < 0 ? 0 : newIndex; // Prevents going before the first item
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + itemsToShow;
      return newIndex > topics.length - itemsToShow ? topics.length - itemsToShow : newIndex; // Prevents going past the last item
    });
  };

  // Using `Math.min` to ensure that we don't try to display topics that don't exist
  const topicsToDisplay = topics.slice(currentIndex, Math.min(currentIndex + itemsToShow, topics.length));

  const progressBarItems = topics.length > itemsToShow ? new Array(Math.ceil(topics.length / itemsToShow)).fill(null) : [];

  return (
    <div className="group relative bg-slate-900">
      <h1 className="text-center pt-8 text-2xl font-bold text-white light:text-white">History</h1>
      <div className='flex items-center justify-center my-1'>
        <button
          className="absolute w-8 h-40 left-0 z-10 m-4 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity duration-300"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          &#8249;
        </button>
        <div className='flex w-full py-12'>
          {topicsToDisplay.map((topic) => (
            <div
              key={topic._id}
              className='w-1/6 flex-shrink-0 flex justify-center'
            >
              <Link href={`/topic-details?topicName=${encodeURIComponent(topic.topic_name)}`} passHref>
                <div className="w-full h-40 flex flex-col justify-between cursor-pointer p-2">
                  <img src={topic.image_url} alt={topic.topic_name} className="w-80 h-40 object-cover rounded-md" />
                  {/* <div className='text-black mt-2'>
                    <h3 className='text-lg font-bold'>{topic.topic_name}</h3>
                    <p className='text-sm'>{topic.category}</p>
                  </div> */}
                </div>
              </Link>
            </div>
          ))}
        </div>
        <button
          className="right-0 z-0 w-8 h-40 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity duration-300"
          onClick={handleNext}
          disabled={currentIndex >= topics.length - itemsToShow}
        >
          &#8250;
        </button>
      </div>
      <div className="flex justify-center mt-1 pb-12">
        {progressBarItems.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-8 mx-1 ${currentIndex / itemsToShow === index ? 'bg-red-500' : 'bg-gray-300'}`}
            onClick={() => {
              const setIndex = index * itemsToShow;
              setCurrentIndex(setIndex >= topics.length ? topics.length - itemsToShow : setIndex);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
