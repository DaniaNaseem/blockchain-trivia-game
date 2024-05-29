import React from 'react';

function End({props}) {
  return (
    
    <div>
      <>
        <div className="flex-1 align-center bg-gray-900 p-16 pt-28 cover-screen">
          <h2 className="text-gray-200 text-center text-5xl mb-10">YOU WIN!</h2>
          <div className='flex justify-center items-center space-x-12 p-24'>
            <img className="w-20 h-20 rounded-full p-2 m-2 bg-white border-8" src="/next.svg" alt="" />  
            <img className='w-10 h-10 justify-center' src='/flash.svg'/>
            <img className="w-20 h-20 rounded-full p-2 m-2 bg-white border-8 " src="/next.svg" alt="" />  
          </div>
          <div className='flex justify-center items-center space-x-12 p-0'>
            <h5 className="w-20 h-20 rounded-full p-2 m-2 ">name1</h5>  
            <span className='w-10 h-10 justify-center'/>
            <h5 className="w-20 h-20 rounded-full p-2 m-2 ">name2</h5>  
          </div>
        </div>
    </>
    </div>
  );
}

export default End;
