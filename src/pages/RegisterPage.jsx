// src/pages/RegisterPage.jsx
import { useState } from 'react';

const RegisterPage = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onRegister({ email, password, name, city });
      setSuccess(true);
      // Limpiar el formulario
      setEmail('');
      setPassword('');
      setName('');
      setCity('');
    } catch (error) {
      alert("Error al registrarse: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>¡Registro exitoso!</h2>
        <p>Serás redirigido al inicio de sesión en unos segundos...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <div><label>Nombre:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div><label>Ciudad:</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div><label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div><label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" style={{ marginTop: '20px' }} disabled={loading}>
          {loading ? "Registrando..." : "Registrarme"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;