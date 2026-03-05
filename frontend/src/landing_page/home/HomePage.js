import React from 'react';
import Hero from './Hero';
import Education from './Education';
import Pricing from './Pricing';
import OpenAccount from '../OpenAccount';


function HomePage() {
    return ( 
        <>
        <Hero/>
        <Pricing/>
        <Education/>
        <OpenAccount/>
        </>
     );
}

export default HomePage;