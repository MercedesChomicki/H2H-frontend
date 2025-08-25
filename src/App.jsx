import './App.css'
import { useState } from 'react';
import ChatComponent from './components/ChatComponent';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { login, register, testEndpoints } from './services/authService';

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [chatWithId, setChatWithId] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (email, password) => {
    await login(email, password);
    // Simulación de IDs (en el futuro podrías pedirlos desde una API)
    const userId = email === 'a@email.com' ? 'userA' : 'userB';
    const otherUserId = userId === 'userA' ? 'userB' : 'userA';

    setCurrentUserId(userId);
    setChatWithId(otherUserId);
  };

  const handleRegister = async (data) => {
    await register(data);
    setTimeout(() => {
      setIsRegistering(false); // Redirige al login después de  3 segundos
    }, 3000);
  };

  const handleTestEndpoints = async () => {
    try {
      await testEndpoints();
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  if (!currentUserId) {
    return isRegistering ? (
      <RegisterPage onRegister={handleRegister} />
    ) : (
      <>
        <LoginPage onLogin={handleLogin} />
        <div style={{ textAlign: 'center' }}>
          <p>¿No tenés cuenta?</p>
          <button onClick={() => setIsRegistering(true)}>Ir a Registro</button>
          <br />
          <button onClick={handleTestEndpoints} style={{ marginTop: '10px', backgroundColor: '#ff6b6b' }}>
            Test Endpoints
          </button>
        </div>
      </>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Chat App</h2>
      <p>
        Estás conectado como: <b>{currentUserId}</b> <br />
        Chateando con: <b>{chatWithId}</b>
      </p>
      <hr />
      <ChatComponent senderId={currentUserId} recipientId={chatWithId} />
    </div>
  );
}

export default App;