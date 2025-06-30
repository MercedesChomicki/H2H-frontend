import './App.css'
import React, { useState } from 'react';
import ChatComponent from './components/ChatComponent';

function App() {
  const [currentUserId, setCurrentUserId] = useState('userA');
  const [chatWithId, setChatWithId] = useState('userB');

  const handleUserChange = () => {
    if (currentUserId === 'userA') {
      setCurrentUserId('userB');
      setChatWithId('userA');
    } else {
      setCurrentUserId('userA');
      setChatWithId('userB');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Chat App (Simulación sin login)</h2>
      <p>
        Estás conectado como: <b>{currentUserId}</b> <br />
        Chateando con: <b>{chatWithId}</b>
      </p>
      <button onClick={handleUserChange}>Cambiar de usuario</button>

      <hr />

      <ChatComponent senderId={currentUserId} recipientId={chatWithId} />
    </div>
  );
}

export default App;