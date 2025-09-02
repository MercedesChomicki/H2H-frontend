import { useState, useEffect } from "react";
import { connectWebSocket, sendMessage } from "../services/chatService";

function ChatComponent({ senderId, recipientId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Usar el email del localStorage como identificador
    const email = localStorage.getItem('email');
    if (!email) {
      console.error('No se encontró email en localStorage');
      return;
    }

    const client = connectWebSocket(email, (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    
    // Verificar conexión
    const checkConnection = setInterval(() => {
      if (client && client.connected) {
        setIsConnected(true);
        clearInterval(checkConnection);
      }
    }, 1000);

    return () => {
      clearInterval(checkConnection);
      if (client) {
        client.deactivate();
      }
    };
  }, [senderId]);

  const handleSend = () => {
    if (message.trim() === "" || !isConnected) return;

    // Obtener el email del destinatario (por ahora usar el recipientId como email)
    const recipientEmail = recipientId === 'userA' ? 'a@email.com' : 'b@email.com';

    // Enviar al backend
    sendMessage(recipientEmail, message);

    // Agregar mensaje local optimista
    setMessages((prev) => [...prev, { from: localStorage.getItem('email'), text: message }]);
    setMessage("");
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        {isConnected ? (
          <span style={{ color: 'green' }}>🟢 Conectado</span>
        ) : (
          <span style={{ color: 'red' }}>🔴 Conectando...</span>
        )}
      </div>
      
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "200px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === localStorage.getItem('email') ? "right" : "left" }}>
            <b>{m.from === localStorage.getItem('email') ? "Yo" : m.from}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribí tu mensaje..."
        disabled={!isConnected}
      />
      <button onClick={handleSend} disabled={!isConnected}>
        Enviar
      </button>
    </div>
  );
}

export default ChatComponent;