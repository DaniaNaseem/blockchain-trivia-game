import UserDetailed from '@/components/UserDetailed'
import React from 'react'
import {useState, useEffect} from 'react';



function match({props}) {

  useEffect(()=>{
    if(props.message && props == "YOU WIN"){

    }
  },[])

  return (
    <div>
      <UserDetailed />
    </div>
  )
}

export default match
