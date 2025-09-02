import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let client;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

const WEBSOCKET_URL = 'http://localhost:8080/api/ws';

export const connectWebSocket = (userId, onMessageReceived) => {
  console.log(userId);  
  console.log('🔌 Conectando a WebSocket a través del gateway:', WEBSOCKET_URL);
  
  const socket = new SockJS(WEBSOCKET_URL);
  
  client = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    onConnect: () => {
      console.log('✅ Conectado al STOMP WebSocket a través del gateway');
      reconnectAttempts = 0;

      // Suscribirse a mensajes privados usando el email como identificador
      const email = localStorage.getItem('email');
      if (email) {
        client.subscribe(`/user/${email}/queue/messages`, (msg) => {
          try {
            const message = JSON.parse(msg.body);
            console.log('📨 Mensaje recibido:', message);
            onMessageReceived({
                from: message.senderId,
                text: message.content
            });
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        });
      }
    },
    onStompError: (frame) => {
      console.error('⚠️ STOMP error:', frame);
    },
    onWebSocketError: (error) => {
      console.error('⚠️ WebSocket error:', error);
    },
    onWebSocketClose: () => {
      console.log('🔌 WebSocket cerrado');
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(`🔄 Intentando reconectar... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
        setTimeout(() => {
          if (client) {
            client.activate();
          }
        }, 3000);
      }
    }
  });

  client.activate();
  return client;
};

export const sendMessage = (recipientId, content) => {
  if (!client || !client.connected) {
    console.error('⚠️ WebSocket no conectado');
    return false;
  }

  const message = {
    senderId: localStorage.getItem('email'),
    recipientId,
    content,
  };

  console.log('📤 Enviando mensaje:', message);

  try {
    client.publish({
      destination: '/app/chat',
      body: JSON.stringify(message)
    });
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
};

export const disconnectWebSocket = () => {
  if (client) {
    console.log('🔌 Desconectando WebSocket');
    client.deactivate();
  }
};