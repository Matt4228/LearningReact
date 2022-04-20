import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function findWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const a = line[0];
    const b = line[1];
    const c = line[2];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return null;

}

function Square(props) {
  if(props.highlight) {
    return (
      <button className="squareHighlighted" onClick={props.onClick}>
        {props.value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        highlight={this.props.highlights[i]}
        onClick={() => this.props.onClick(i)}
      />
      );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        highlights: Array(9).fill(false),
        order: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const currOrder = current.order.slice();
    let highlights = Array(9).fill(false);


    if (calculateWinner(squares) || squares[i]) {
      return;
    } else {
      highlights[i] = true;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    currOrder[this.state.stepNumber] = i;
    
    this.setState({
      history: history.concat([{
        squares: squares,
        highlights: highlights,
        order: currOrder
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  compare(move) {
    const history = this.state.history;
    const curr = history[move];
    const last = history[move - 1];

    for(var i = 0; i < 9; i++) {
      if(curr.squares[i] !== last.squares[i]){
        return i;
      }
    }
  }

  getCol(move) {
    if (move === 0) {
      return;
    } else {
      const index = this.compare(move);
      return index % 3 + 1;
    }
  }

  getRow(move) {
    if (move === 0) {
      return;
    } else {
      const index = this.compare(move);
      return Math.floor(index / 3) + 1;
    }
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    if(calculateWinner(current.squares)){
      const line = findWinner(current.squares)
      current.highlights[line[0]] = true;
      current.highlights[line[1]] = true;
      current.highlights[line[2]] = true;
    }
    
    
    

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + " (" + this.getCol(move) + "," + this.getRow(move) + ")" :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.stepNumber === 9) {
      status = 'It\'s a draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            highlights = {current.highlights}
            onClick = {i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Game />);


// ReactDOM.render(
//   <Game />,
//   document.getElementById('root')
// );
