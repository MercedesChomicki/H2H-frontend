import { useState } from 'react';

const RegisterPage = ({ onRegister, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailExistsError(false);

    try {
      // Si onRegister tira un error, va directo al catch
      await onRegister({ email, password, name, city });

      // Solo acá se marca como éxito
      setSuccess(true);

      // Limpiar formulario
      setName('');
      setCity('');
      setEmail('');
      setPassword('');
    } catch (error) {
      if (error.code === "EMAIL_EXISTS") {
        setEmailExistsError(true);
      } else {
        setSuccess(false); // aseguramos que NO se muestre el mensaje de éxito
      }
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

      {emailExistsError && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: 'red' }}>Este email ya está registrado.</p>
          <button 
            style={{ 
              marginTop: '10px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              padding: '10px 15px',
              borderRadius: '6px',
              border: 'none'
            }}
            onClick={onBackToLogin} // 👈 volvemos sin recargar
          >
            Volver al Login
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;