import React, { useState, useEffect } from 'react';

function User({ userScore }) {
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
    <div className='flex'>
      <img className="w-10 h-10 rounded-full p-2 m-2 bg-white" src="/next.svg" alt="" />
      <div className="info">
        {userData ? (
          <>
            <p className=''>{userData.username}</p>
            <p className="title">Associate Professor at FAST</p>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
        <h2 className='font-bold'>{userScore}</h2>
      </div>
    </div>
  );
}

export default User;
