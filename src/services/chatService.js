import { Client } from '@stomp/stompjs';
import { WEBSOCKET_URL } from '../config';

let client;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const connectWebSocket = (userId, onMessageReceived) => {
  console.log('🔌 Conectando a WebSocket a través del gateway:', WEBSOCKET_URL);
  
  client = new Client({
    brokerURL: WEBSOCKET_URL, // 👈 conecta directo, sin SockJS
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    onConnect: () => {
      console.log('✅ Conectado al STOMP WebSocket a través del gateway');
      reconnectAttempts = 0;
      
      client.subscribe(`/user/queue/messages`, (msg) => {
        try {
          const message = JSON.parse(msg.body);
          console.log('📨 Mensaje recibido:', message);
          onMessageReceived({
              from: message.senderId,
              fromName: message.senderUsername,
              text: message.content
          });
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
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
    senderId: localStorage.getItem('userId'),
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