import React from 'react';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import Story from './components/Story';
import Gallery from './components/Gallery';
import CTA from './components/CTA';

function App() {
  return (
    <div className="app-container">
      <Hero />
      <Benefits />
      <Story />
      <Gallery />
      <CTA />
    </div>
  );
}

export default App;
