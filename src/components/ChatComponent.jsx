import { useState, useEffect } from "react";
import { connectWebSocket, sendMessage } from "../services/chatService";

function ChatComponent({ senderId, recipientId, recipientName }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    const client = connectWebSocket(userId, (msg) => {
      setMessages(prev => [...prev, msg]);
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
  }, [senderId]);

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