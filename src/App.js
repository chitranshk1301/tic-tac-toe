import React, { useState, useEffect } from 'react';

const App = () => {
  const [gridSize, setGridSize] = useState(3);
  const [winStreak, setWinStreak] = useState(3);
  const [board, setBoard] = useState(Array(gridSize ** 2).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    setBoard(Array(gridSize ** 2).fill(null));
    setWinner(null);
    setCurrentPlayer('X');
  }, [gridSize, winStreak]);

  const handleCellClick = (index) => {
    if (winner || board[index]) return;

    const updatedBoard = [...board];
    updatedBoard[index] = currentPlayer;
    setBoard(updatedBoard);

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    checkForWinner(updatedBoard);
  };

  const checkForWinner = (board) => {
    const lines = calculateLines();

    for (let line of lines) {
      const marksInLine = new Set(line.map((index) => board[index]));
      if (marksInLine.size === 1 && marksInLine.has(currentPlayer)) {
        setWinner(currentPlayer);
        return;
      }
    }

    if (!board.includes(null)) {
      setWinner('Draw');
    }
  };

  const calculateLines = () => {
    const lines = [];

    // Horizontal lines
    for (let row = 0; row <= gridSize - winStreak; row++) {
      for (let col = 0; col < gridSize; col++) {
        const line = [];
        for (let i = 0; i < winStreak; i++) {
          line.push((row + i) * gridSize + col);
        }
        lines.push(line);
      }
    }

    // Vertical lines
    for (let col = 0; col <= gridSize - winStreak; col++) {
      for (let row = 0; row < gridSize; row++) {
        const line = [];
        for (let i = 0; i < winStreak; i++) {
          line.push(row * gridSize + col + i);
        }
        lines.push(line);
      }
    }

    // Diagonal lines (top-left to bottom-right)
    for (let row = 0; row <= gridSize - winStreak; row++) {
      for (let col = 0; col <= gridSize - winStreak; col++) {
        const line = [];
        for (let i = 0; i < winStreak; i++) {
          line.push((row + i) * gridSize + col + i);
        }
        lines.push(line);
      }
    }

    // Diagonal lines (top-right to bottom-left)
    for (let row = 0; row <= gridSize - winStreak; row++) {
      for (let col = winStreak - 1; col < gridSize; col++) {
        const line = [];
        for (let i = 0; i < winStreak; i++) {
          line.push((row + i) * gridSize + col - i);
        }
        lines.push(line);
      }
    }

    return lines;
  };

  const renderBoard = () => {
    const cellSize = `minmax(50px, ${100 / gridSize}%)`;

    return (
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize})`,
          aspectRatio: '1/1',
        }}
      >
        {board.map((cell, index) => (
          <div
            key={index}
            className="border border-gray-400 flex items-center justify-center text-2xl cursor-pointer"
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
    );
  };

  const resetGame = () => {
    setGridSize(gridSize);
    setWinStreak(winStreak);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gradient-to-r from-slate-500 to-slate-800">
      <h1 className="text-2xl font-bold mb-4">Customizable Tic-Tac-Toe</h1>
      <div className="mb-4">
        <label htmlFor="gridSize" className="block mb-2">
          Grid Size (3-10):
        </label>
        <input
          type="number"
          id="gridSize"
          value={gridSize}
          min="3"
          max="10"
          onChange={(e) => setGridSize(parseInt(e.target.value, 10))}
          className="border border-gray-400 px-2 py-1 rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="winStreak" className="block mb-2">
          Win Streak (3-{gridSize}):
        </label>
        <input
          type="number"
          id="winStreak"
          value={winStreak}
          min="3"
          max={gridSize}
          onChange={(e) => setWinStreak(parseInt(e.target.value, 10))}
          className="border border-gray-400 px-2 py-1 rounded"
        />
      </div>
      {renderBoard()}
      {winner && (
        <div className="mt-4">
          <p className="text-lg font-bold">
            {winner === 'Draw' ? 'It\'s a draw!' : `${winner} wins!`}
          </p>
          <button
            onClick={resetGame}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;