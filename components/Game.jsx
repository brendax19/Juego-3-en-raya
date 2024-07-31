import React, { useState, useEffect } from 'react';
import Board from './Board';
import './Game.css';

const calculateWinner = (squares) => {
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
};

const MovesList = ({ history, currentStep, jumpTo }) => (
  <ol>
    {history.slice(1).map((step, move) => {
      const desc = `Ir al movimiento #${move + 1}`;
      return (
        <li key={move + 1}>
          <button
            onClick={() => jumpTo(move + 1)}
            className={move + 1 === currentStep ? 'bold' : ''}
          >
            {desc}
          </button>
        </li>
      );
    })}
  </ol>
);

const Game = () => {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  useEffect(() => {
    if (!xIsNext) {
      const current = history[stepNumber];
      const emptySquares = current.squares
        .map((val, idx) => (val === null ? idx : null))
        .filter(val => val !== null);

      if (emptySquares.length > 0 && !calculateWinner(current.squares)) {
        const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
        handleClick(randomIndex);
      }
    }
  }, [xIsNext, history, stepNumber]);

  const handleClick = (i) => {
    const historyUpToStep = history.slice(0, stepNumber + 1);
    const current = historyUpToStep[historyUpToStep.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(historyUpToStep.concat([{ squares }]));
    setStepNumber(historyUpToStep.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
  };

  const resetGame = () => {
    setHistory([{ squares: Array(9).fill(null) }]);
    setStepNumber(0);
    setXIsNext(true);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const getStatus = () => {
    if (winner) return winner === 'X' ? 'Has ganado' : 'Has perdido';
    if (current.squares.every(square => square !== null)) return 'Empate';
    return `Siguiente jugador: ${xIsNext ? 'X' : 'O'}`;
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={handleClick} />
      </div>
      <div className="game-info">
        <div>{getStatus()}</div>
        <MovesList history={history} currentStep={stepNumber} jumpTo={jumpTo} />
        <button onClick={resetGame}>Resetear Juego</button>
      </div>
    </div>
  );
};

export default Game;
