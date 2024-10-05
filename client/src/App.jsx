import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

const SudokuGame = () => {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [board, setBoard] = useState([]);
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
    if (room) {
      socket.emit('join_room', room);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { room, message });
      setMessage('');
    }
  };

  const handleChange = (rowIndex, colIndex, value) => {
    // Validate the input value (ensure it's a number from 1 to 9 or empty)
    if (/^[1-9]?$/.test(value)) {
      const newBoard = board.map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return row.map((cell, cIndex) => (cIndex === colIndex ? value : cell));
        }
        return row;
      });
      setBoard(newBoard);
      socket.emit('update_board', newBoard);
    }
  };

  useEffect(() => {
    socket.on('initial_board', (initialBoard) => {
      setBoard(initialBoard);
    });
    socket.on('update_board', (newBoard) => {
      setBoard(newBoard);
    });

    return () => {
      socket.off('initial_board');
      socket.off('update_board');
    };
  }, []);

  return (
    <div className="sudoku-container">
    <h1>Sudoku Game</h1>
    <input
      type="text"
      value={room}
      onChange={(e) => setRoom(e.target.value)}
      placeholder="Room number"
      className="room-input"
    />
    <button onClick={joinRoom} className="join-button">Join Room</button>
    
    {joined && (
      <>
        <div className="sudoku-board">
          <h2>Sudoku</h2>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="sudoku-row">
              {row.map((cell, colIndex) => (
                <input
                  key={colIndex}
                  type="text"
                  value={cell}
                  onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                  maxLength="1"
                  className="sudoku-cell"
                />
              ))}
            </div>
          ))}
        </div>
      </>
    )}
  </div>
  );
};

export default SudokuGame;
