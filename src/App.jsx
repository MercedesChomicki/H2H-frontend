import './index.css'
import { useState, useEffect } from 'react';
import ChatComponent from './components/ChatComponent';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { login, register, testEndpoints } from './services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import { fetchUsers } from "./services/userService";

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [chatWithId, setChatWithId] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [users, setUsers] = useState([]);

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password); 
      localStorage.setItem('token', data.token);

      // extraer userId del JWT
      const decoded = jwtDecode(data.token);
      const userId = decoded.sub; // 👈 este es el UUID del backend

      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email); // opcional

      setCurrentUserId(userId);
      setChatWithId(null);
    } catch (error) {
        toast.error(error.message || "Error al iniciar sesión");
    }
  };

  useEffect(() => {
    if (!currentUserId) return;

    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        // Filtrar al usuario logueado
        setUsers(data.filter(u => u.id !== currentUserId));
      } catch (err) {
        console.error("No se pudieron cargar los usuarios:", err);
      }
    };

    loadUsers();
  }, [currentUserId]);


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
          <div style={{ textAlign: 'center' }}>
            <h2>Bienvenido a Chat App</h2>
            <LoginPage onLogin={handleLogin} />
            <p>¿No tenés cuenta?</p>
            <button onClick={() => setIsRegistering(true)}>Ir a Registro</button>
            <br />
            <button 
              onClick={handleTestEndpoints} 
              style={{ marginTop: '10px', backgroundColor: '#ff6b6b' }}
            >
              Test Endpoints
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Chat App</h2>
      <p>Estás conectado como: <b>{currentUserId}</b></p>

      <h3>Elegí con quién chatear:</h3>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
        {users.map(user => (
            <button key={user.id} onClick={() => setChatWithId(user.id)}>
              {user.name || user.email}
            </button>
        ))}
      </div>

      {chatWithId ? (
        <ChatComponent senderId={currentUserId} recipientId={chatWithId} />
      ) : (
        <p>⚡ Elegí un usuario para empezar a chatear</p>
      )}
    </div>
  );
}

export default App;