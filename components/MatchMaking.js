import React from 'react';
import {useState, useEffect} from 'react'

function MatchMaking() {


    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Get the token from local storage
        const token = localStorage.getItem('user_detail_token');
    
        if (!token) {
          // Handle the case where the token is not found in local storage
          console.error('Token not found in local storage');
          return;
        }
    
        // Fetch user details using the token
        const fetchUserDetails = async () => {
          try {
            const response = await fetch('http://3.134.237.219:3000/api/user', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
    
            if (response.ok) {
              const userData = await response.json();
              setUserData(userData);
            } else {
              // Handle the case where the request is not successful
              console.error('Failed to fetch user details');
            }
          } catch (error) {
            // Handle network errors
            console.error('Network error while fetching user details');
          }
        };
    
        fetchUserDetails();
      }, []);


  return (
    <>
    {userData ? 
            <div>
            <>
              <div className="flex-1 align-center bg-gray-900 p-16 pt-28 cover-screen">
                <h2 className="text-gray-200 text-center text-5xl mb-10">Looking for Match...</h2>
                <div className='flex justify-center items-center space-x-12 p-24'>
                  <img className="w-20 h-20 rounded-full p-2 m-2 bg-white border-8" src="/next.svg" alt="" />  
                  <img className='w-10 h-10 justify-center' src='/flash.svg'/>
                  <img className="w-20 h-20 rounded-full p-2 m-2 bg-white border-8 " src="/next.svg" alt="" />  
                </div>
                <div className='flex justify-center items-center space-x-12 p-0'>
                  <h5 className="w-20 h-20 rounded-full p-2 m-2 ">{userData.username}</h5>  
                  <span className='w-10 h-10 justify-center'/>
                  <h5 className="w-20 h-20 rounded-full p-2 m-2 ">???</h5>  
                </div>
              </div>
          </>
          </div>
        :<>
        
            <h3>Looking for match</h3>
        </>
    }

    </>
  );
}

export default MatchMaking;
