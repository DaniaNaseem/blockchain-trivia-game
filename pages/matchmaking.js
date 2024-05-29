import React from 'react';
import {useState} from 'react'
import MatchMaking from '@/components/MatchMaking';



function MatchPage() {
  
    const [username, setUsername] = useState("newuser");

    return (<>
        {username && username == "newuser"?
            <MatchMaking username="newuser"/>
        :<>
        
        </>}
        </>
    );
}

export default MatchPage;
