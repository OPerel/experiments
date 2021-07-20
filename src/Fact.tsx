import React, { useState, useEffect } from 'react';
import './App.css';

import { FactInterface, FactService } from './types';

const Fact: React.FC = () => {
  let [fact, getNewFact] = useState<FactService<FactInterface>>({
    status: 'loading'
  });
  const getFact = () => {
    getNewFact({ status: 'loading' })
    fetch(`https://uselessfacts.jsph.pl/random.json?language=en`)
      .then(res => res.json())
      .then((res: FactInterface) => {
        // console.log(res)
        getNewFact({ status: 'loaded', payload: res })
      })
      .catch(error => getNewFact({ status: 'error', error }));
  }
  
  useEffect(() => {
    getFact();
    // setInterval(() => {
    //   getFact();
    // }, 6000)
    
  }, [])

  return (
    <div className="fact">
      {fact.status === 'loading' && <p>Loading...</p>}
      {fact.status === 'loaded' && <h2>{fact.payload.text}</h2>}
      <button onClick={getFact}>Next Fact</button>
    </div>
  );
}

export default Fact;
