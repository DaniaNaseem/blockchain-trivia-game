import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import hero from '../public/hero-3.jpg';

function Hero() {
  
  return (
    <section className='flex-grow bg-slate-100 flex flex-col'>
      <div className='bg-auto bg-center flex flex-1 items-center justify-center relative cover-screen-height'>
        <Image
          src={hero}
          alt=''
          layout='fill'
          objectFit='cover'
          objectPosition='center'
        />
        <div className='inset-0  w-full'>
          <div className='m-96 relative'>
          <h1 className='text-8xl text-center font-extrabold text-white'>A P2E Game on Cardano</h1>
        </div>
        </div>
        <div>
        </div>
      </div>
    </section>
  );
}

export default Hero;