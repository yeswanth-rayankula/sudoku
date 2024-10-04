import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
const SERVER_URL = 'http://localhost:8000'; 

function App() {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (msg) => {
        setReceivedMessages((prevMessages) => [...prevMessages, msg]);
      });
      socket.on('notification', (notification) => {
        console.log(notification);
      });
    }
  }, [socket]);

  const joinRoom = () => {
    if (room && socket) {
      socket.emit('join_room', room);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() && room && socket) {
      socket.emit('send_message', { room, message });
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Join a Room</h1>

      {!joined ? (
        <div>
          <input
            type="text"
            placeholder="Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <h2>Room: {room}</h2>
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send Message</button>
        </div>
      )}

      <div>
        <h2>Messages:</h2>
        <ul>
          {receivedMessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
