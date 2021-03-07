import React from 'react';
import './Start.css';

const Start = (props) => {
  const { startGame } = props;

  return (
    <section  className="rules-container">
      <h2 className="headline" >RULES</h2>
      <p>You will be given a quote from a character in Breaking Bad and three characters</p>
      <p>Choose the character that you think authored the quote</p> 
      <h3>Be the one who knocks to start a game</h3>
      
      <button 
        onClick={() => startGame()}
        className ="knock-button hover-states">
        KNOCK
      </button>
    </section>
  )
}

export default Start;