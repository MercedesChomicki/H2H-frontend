// src/services/authService.js
export const register = async ({ name, city, email, password }) => {
  const response = await fetch('http://localhost:8080/api/users/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, city, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || 'El usuario ya está registrado';

    if (response.status === 409) {
      // 👇 ahora lanzamos con code para que RegisterPage lo detecte
      throw { status: 409, code: "EMAIL_EXISTS", message };
    }

    throw new Error(message);
  }

  return await response.json(); // Devuelve el usuario creado
};

export const login = async (email, password) => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    // Si el backend devuelve { error: "Contraseña incorrecta" }
    const message = errorData?.error || "Error al iniciar sesión";
    throw new Error(message);
  }

  const data = await response.json();
  console.log('Email:', data.email);
  console.log('Rol:', data.role);
  return data;
};

export const forgotPassword = async (email) => {
  const response = await fetch(`http://localhost:8080/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
    method: "POST",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error al enviar correo de recuperación");
  }
  return await response.text();
};

export const resetPassword = async (token, newPassword) => {
  const response = await fetch("http://localhost:8080/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error al restablecer contraseña");
  }
  return await response.text();
};