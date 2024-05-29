import { Inter } from 'next/font/google'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import CarouselAll from '@/components/CarouselAllTopics';
import CarouselNew from '@/components/CarouselNewTopics';
import CarouselGeneralKnowledge from '@/components/CarouselGeneralKnowledgeTopics'
import CarouselMusic from '@/components/CarouselMusicTopics'
import CarouselPeopleAndPlaces from '@/components/CarouselPeopleAndPlaces'
import CarouselHistory from '@/components/CarouselHistoryTopics'
import CarouselAnime from '@/components/CarouselAnimeTopics'
import CarouselAcademic from '@/components/CarouselAcademicTopics'
import Footer from '@/components/Footer';
import {useState, useEffect} from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  //const token = process.env.NEXT_PUBLIC_TOKEN
  //console.log(`token = ${token}`)



  return (
    <>
    <div>
      <div className='bg-white min-h-screen relative z-10'>
      <div className="flex flex-col h-screen">
        <Navbar/>
        <Hero/>
      </div>
      <CarouselAll />
      <CarouselNew />
      
      <CarouselMusic/>
      <CarouselGeneralKnowledge/>
      <CarouselAnime/>
      <CarouselPeopleAndPlaces/>
      <CarouselHistory/>
      
      <CarouselAcademic/>
      <Footer />
      </div>
    
    </div>
    </>
  );
}
