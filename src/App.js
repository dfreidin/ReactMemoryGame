import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.rows = 5;
    this.cols = 8;
    this.state = {
      display_grid: this.newGrid(() => "grey"),
      phase: "start",
      timer: 0
    }
    this.golden_grid = [];
  }
  newGrid(fillFunc) {
    let grid = [];
    for(let i=0; i<this.rows; i++) {
      grid.push([])
      for(let j=0; j<this.cols; j++) {
        grid[i].push(fillFunc());
      }
    }
    return grid;
  }
  newGame() {
    this.golden_grid = this.newGrid(() => Math.random() > 0.6 ? "blue" : "grey");
    this.setState({
      display_grid: this.newGrid(() => "grey"),
      phase: "prep",
      timer: 3
    });
    setTimeout(this.countdown.bind(this), 1000);
  }
  countdown() {
    if(this.state.timer > 1) {
      this.setState({
        timer: this.state.timer - 1
      });
      setTimeout(this.countdown.bind(this), 1000);
    }
    else {
      this.setState({
        phase: "showing",
        display_grid: this.golden_grid
      });
      setTimeout(this.waitForGuess.bind(this), 3000);
    }
  }
  waitForGuess() {
    this.setState({
      phase: "guessing",
      display_grid: this.newGrid(() => "grey")
    });
  }
  guessCell(row, col) {
    if(this.state.phase === "guessing") {
      let grid = [];
      for(let i=0; i<this.rows; i++) {
        grid.push(this.state.display_grid[i].slice());
      }
      grid[row][col] = grid[row][col] === "grey" ? "blue" : "grey";
      this.setState({
        display_grid: grid
      })
    }
  }
  checkGuesses() {
    let grid = [];
    for(let i=0; i<this.rows; i++) {
      grid.push([]);
      for(let j=0; j<this.cols; j++) {
        grid[i].push(this.state.display_grid[i][j] === this.golden_grid[i][j] ? (this.golden_grid[i][j] === "blue" ? "green" : "grey") : this.state.display_grid[i][j] === "blue" ? "yellow" : "red");
      }
    }
    this.setState({
      phase: "results",
      display_grid: grid
    });
  }
  render() {
    return (
      <div className="App">
        {this.state.display_grid.map((row, ir) => {
          return (
            <div>
              {row.map((cell, ic) => <div style={{height: "50px",
                width: "50px",
                backgroundColor: cell,
                display: "inline-block",
                border: "solid black",
                verticalAlign: "top"
              }} onClick={() => this.guessCell(ir, ic)} />)}
            </div>
          )
        })}
        {this.state.phase === "start" ? <button onClick={this.newGame.bind(this)}>Start Game</button> : null}
        {this.state.phase === "prep" ? <p>Get ready to memorize cells in {this.state.timer}</p> : null}
        {this.state.phase === "guessing" ? (
          <div>
            <p>Click on the cells that were blue</p>
            <button onClick={this.checkGuesses.bind(this)}>Done Guessing</button>
          </div>
          ) : null}
        {this.state.phase === "results" ? <button onClick={this.newGame.bind(this)}>Play Again</button> : null}
      </div>
    );
  }
}

export default App;
