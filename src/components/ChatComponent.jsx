import { useState, useEffect } from "react";
import { connectWebSocket, sendMessage } from "../services/chatService";
import { fetchUserById } from "../services/userService";

function ChatComponent({ senderId, recipientId, recipientName, usersById, setUsersById }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    const client = connectWebSocket(userId, async (msg) => {
      // 🟦 1. Resolver nombre localmente
      const senderName = 
        msg.from === senderId 
          ? localStorage.getItem('name') 
          : usersById[msg.from] || msg.fromName || "Unknown";

      // 🟨 2. Si el nombre es Unknown pero no es mi propio mensaje → buscarlo del backend
      if (senderName === "Unknown" && msg.from !== senderId) {
        try {
          const user = await fetchUserById(msg.from);  // llamada al backend
          if (user) {
            senderName = user.name;

            // 🔥 Cachear usuario para no volver a pedirlo
            setUsersById(prev => ({ ...prev, [user.id]: user.name }));
          }
        } catch (e) {
          console.warn("No se pudo obtener el usuario:", msg.from);
        }
      }
      // 🟩 3. Guardar el mensaje ya con nombre correcto
      setMessages(prev => [...prev, { ...msg, fromName: senderName }]);
    });
    
    const checkConnection = setInterval(() => {
      if (client && client.connected) {
        setIsConnected(true);
        clearInterval(checkConnection);
      }
    }, 1000);

    return () => {
      clearInterval(checkConnection);
      if (client) client.deactivate();
    };
  }, [senderId, usersById]);

  const handleSend = () => {
    if (message.trim() === "" || !isConnected) return;

    sendMessage(recipientId, message);

    setMessages((prev) => [...prev, { from: senderId, fromName: localStorage.getItem('name'), text: message }]);
    setMessage("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        Chateando con {recipientName}
      </div>

      <div className="status">
        <span className={`dot ${isConnected ? "green" : "red"}`}></span>
        {isConnected ? "Conectado" : "Conectando..."}
      </div>
      
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.from === senderId ? "own" : "other"}`}>
            {m.from === senderId ? "Yo: " : `${m.fromName}: `}{m.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribí tu mensaje..."
          disabled={!isConnected}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={!isConnected}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default ChatComponent;