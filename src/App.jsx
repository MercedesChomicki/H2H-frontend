import './App.css'
import { useState } from 'react';
import ChatComponent from './components/ChatComponent';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { login, register, testEndpoints } from './services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [chatWithId, setChatWithId] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password); 
      
      // Guardar en localStorage lo necesario
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('email', email);

      setCurrentUserId(data.userId);
    
      // Por ahora, para testear, podés hardcodear con quién chatear:
      setChatWithId("idDeOtroUsuario");
    } catch (error) {
        toast.error(error.message || "Error al iniciar sesión");
    }
  };

  const handleRegister = async (data) => {
    try {
      await register(data);
      toast.success("¡Registro exitoso! Redirigiendo...");
      setTimeout(() => {
        setIsRegistering(false); 
      }, 3000);
    } catch (error) {
      if (error.status === 409) {
        toast.warning("Este email ya está registrado");
        // re-lanzamos con un flag para que RegisterPage lo sepa
        throw { ...error, code: "EMAIL_EXISTS" };
      } else {
        toast.error(error.message || "Error al registrarse");
        throw error;
      }
    }
  };


  const handleTestEndpoints = async () => {
    try {
      await testEndpoints();
      toast.success("✅ Endpoints funcionando correctamente");
    } catch (error) {
      console.error('Test failed:', error);
      toast.error("❌ Test de endpoints fallido");
    }
  };

  if (!currentUserId) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        {isRegistering ? (
          <RegisterPage 
            onRegister={handleRegister} 
            onBackToLogin={()=>setIsRegistering(false)}/>
        ) : (
          <>
            <LoginPage onLogin={handleLogin} />
            <div style={{ textAlign: 'center' }}>
              <p>¿No tenés cuenta?</p>
              <button onClick={() => setIsRegistering(true)}>Ir a Registro</button>
              <br />
              <button 
                onClick={handleTestEndpoints} 
                style={{ marginTop: '10px', backgroundColor: '#ff6b6b', color: '#fff' }}
              >
                Test Endpoints
              </button>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <ToastContainer position="top-right" autoClose={3000} />
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