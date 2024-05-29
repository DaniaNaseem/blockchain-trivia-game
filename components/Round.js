import React from 'react';

function Round({number}) {
  return (
    
    <div>
      {number < 11? (<>
        
          <h2 className="text-gray-200 text-center text-5xl mb-10">ROUND {number}</h2>  
        
    </>):(<>
        
          <h2 className="text-gray-200 text-center text-5xl mb-10">Calculating Score</h2>  
        
    </>)}
      
    </div>
  )
}

export default Round
