// src/services/authService.js
// Add this function to test the endpoints
export const testEndpoints = async () => {
  try {
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:8080/api/users/auth/health');
    console.log('Health response:', await healthResponse.text());
    
    // Test database connection
    const dbResponse = await fetch('http://localhost:8080/api/users/auth/db-test');
    console.log('DB response:', await dbResponse.text());
    
    // Test registration without validation
    const testResponse = await fetch('http://localhost:8080/api/users/auth/test-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: 'Test User', city: 'Test City', email: 'test@example.com', password: 'password123' }),
    });
    console.log('Test registration response:', await testResponse.text());
    
    // Test registration without validation (new endpoint)
    const uniqueEmail = 'test' + Date.now() + '@example.com';
    const noValidationResponse = await fetch('http://localhost:8080/api/users/auth/register-no-validation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: 'Test User', city: 'Test City', email: uniqueEmail, password: 'password123' }),
    });
    console.log('No validation registration response:', await noValidationResponse.text());
    
    // Test the actual register endpoint with unique email
    const registerResponse = await fetch('http://localhost:8080/api/users/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: 'Test User', city: 'Test City', email: uniqueEmail + '2', password: 'password123' }),
    });
    console.log('Register response status:', registerResponse.status);
    console.log('Register response:', await registerResponse.text());
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

export const register = async ({ name, city, email, password }) => {
  const response = await fetch('http://localhost:8080/api/users/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, city, email, password }),
  });

  if (!response.ok) throw new Error('Registro inválido');

  return await response.json(); // Te devuelve el usuario creado
};

export const login = async (email, password) => {
  const response = await fetch('http://localhost:8080/api/users/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Login inválido');

  const data = await response.json();
  localStorage.setItem('token', data.token);
  console.log('Email:', data.email);
  console.log('Rol:', data.role);
};