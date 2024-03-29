import React, { Component } from "react";
import PropTypes from "prop-types";
import Start from "../Start/Start";
import Characters from "../Characters/Characters";
import Turn from "../Turn/Turn";
import httpRequests from "../../httpRequests.js";
import utilities from "../../utilities.js";
import "./Game.css";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: [],
      characters: [],
      currentQuote: {},
      pastQuotes: [],
      correctAnswers: 0,
      gameOn: false,
      hasGuessed: false,
      guessedCorrect: false,
      gameOver: false,
    };
    this.baseState = this.state;
  }

  componentDidMount = () => {
    this.getData();
  };

  getData = () => {
    httpRequests
      .getAllQuotes()
      .then((quotes) => this.assignStateFromData(quotes.quotes))
      .then(() => this.getQuote())
      .catch(() => this.props.handleError("error"));
  };

  assignStateFromData = (quotes) => {
    const characters = this.getCharacters(quotes);

    this.setState({ quotes: quotes, characters: characters });
  };

  getCharacters = (quotes) => {
    const characters = quotes.reduce((acc, quote) => {
      if (!acc.includes(quote.author.name)) {
        acc.push(quote.author.name);
      }

      return acc;
    }, []);

    return characters;
  };

  getQuote = () => {
    const quotes = this.state.quotes;
    const randomQuote = quotes[utilities.getRandomIndex(quotes)];
    const filteredQuotes = quotes.filter(
      (quote) => quote.quote.toUpperCase !== randomQuote.quote.toUpperCase()
    );

    this.setState({
      quotes: filteredQuotes,
      currentQuote: randomQuote,
    });
  };

  startGame = () => {
    this.setState({ gameOn: true });
  };

  makeGuess = (event) => {
    const guess = event.target.closest("article").id.toUpperCase();
    const correctAnswer = this.state.currentQuote.author.name.toUpperCase();

    if (guess === correctAnswer) {
      this.setState({
        correctAnswers: this.state.correctAnswers + 1,
        guessedCorrect: true,
      });
    }

    this.setState({
      pastQuotes: [...this.state.pastQuotes, this.state.currentQuote],
      hasGuessed: true,
    });
    
    this.checkForEnd();
  };

  checkForEnd = () => {
    const amountPastQuotes = this.state.pastQuotes.length + 1;
    if (amountPastQuotes > 9) {
      this.setState({ gameOver: true });

      setTimeout(() => {
        this.setState(this.baseState);
        this.getData();
      }, 5000);
      
    } else {
      this.switchQuote();
    }
  };

  switchQuote = () => {
    setTimeout(() => {
      this.getQuote();
      this.setState({
        hasGuessed: false,
        guessedCorrect: false,
      });
    }, 3000);
  };

  scoreGame = () => {
    const score = this.state.correctAnswers / this.state.pastQuotes.length;
    const scorePercent = (score * 100).toFixed();

    return `${scorePercent}%`;
  };

  render() {
    return (
      <section>
        {!this.state.gameOn && !this.state.currentQuote && <h2>loading...</h2>}

        {!this.state.gameOn && this.state.currentQuote && (
          <Start startGame={this.startGame} />
        )}

        {this.state.gameOn &&
          this.state.currentQuote &&
          !this.state.hasGuessed &&
          this.state.characters && (
            <section className="quote-container">
              <h2 className="headline">QUOTE:</h2>
              <h3 className="quote">{this.state.currentQuote.quote}</h3>
              <Characters
                key={this.state.currentQuote.id}
                correctAnswer={this.state.currentQuote.author.name}
                characters={this.state.characters}
                makeGuess={this.makeGuess}
              />
            </section>
          )}

        {this.state.gameOn && this.state.hasGuessed && (
          <Turn
            isCorrect={this.state.guessedCorrect}
            correctAuthor={this.state.currentQuote.author}
            gameOver={this.state.gameOver}
            scoreGame={this.scoreGame}
          />
        )}
      </section>
    );
  }
}

export default Game;

Game.propTypes = {
  handleError: PropTypes.func.isRequired,
};
