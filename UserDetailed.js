import React from 'react'
import Image from 'next/image'

function UserDetailed() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <Image 
        src="/next.svg" 
        alt=""
        width={10}
        height={10}
      />
      <div className="info">
        <p className=''>Username</p>
        <p className="title">user title</p>
        <h2 className='font-bold'>0</h2>
        <div className='flex p-2 py-4'>
            <div className='text-lg font-bold mx-2 p-3 border-4 rounded-full'>1</div>
            <div className='flex flex-col m-4'>
                <p className='flex-none'>Playing from</p> 
                <p className='flex-none'>Arizona, USA</p>
            </div>
            
            </div>
      </div>
    </div>
  )
}

export default UserDetailed
