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

   // ⚡ Lista de usuarios "simulados" (luego puede venir de tu backend)
  const users = [
    { id: "florencia@gmail.com", name: "Florencia" },
    { id: "lucasbarrientos@gmail.com", name: "Lucas" },
    { id: "camilarodriguez@gmail.com", name: "Camila" },
  ];

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password); 
      
      // Guardar en localStorage lo necesario
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', email);
      localStorage.setItem('email', email);

      setCurrentUserId(email);
      setChatWithId(null);
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
        Estás conectado como: <b>{currentUserId}</b>
      </p>

      {/* 🔹 Selector de usuarios */}
      <h3>Elegí con quién chatear:</h3>
      <ul>
        {users
          .filter(u => u.id !== localStorage.getItem('email')) // no mostrarse a sí mismo
          .map(user => (
            <li key={user.id}>
              <button onClick={() => setChatWithId(user.id)}>
                {user.name}
              </button>
            </li>
        ))}
      </ul>

      <hr />

      {chatWithId ? (
        <>
          <p>Chateando con: <b>{chatWithId}</b></p>
          <ChatComponent senderId={currentUserId} recipientId={chatWithId} />
        </>
      ) : (
        <p>⚡ Elegí un usuario para empezar a chatear</p>
      )}
    </div>
  );
}

export default App;