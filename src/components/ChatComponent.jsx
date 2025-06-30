import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatComponent = ({ senderId, recipientId }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const stompClientRef = useRef(null); // 👈 esto guarda la instancia

  useEffect(() => {
    const socket = new SockJS('/api/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        const channelId = generateChannelId(senderId, recipientId);
        client.subscribe(`/topic/private-chat/${channelId}`, (msg) => {
          const received = JSON.parse(msg.body);
          setChatMessages((prev) => [...prev, received]);
        });
      },
    });

    stompClientRef.current = client; // 👈 guardamos la instancia
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [senderId, recipientId]);

  const generateChannelId = (u1, u2) => (u1 < u2 ? `${u1}-${u2}` : `${u2}-${u1}`);

  const sendMessage = () => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/chat',
        body: JSON.stringify({ senderId, recipientId, content: message }),
      });
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        {chatMessages.map((msg, idx) => (
          <p key={idx}><b>{msg.senderId}:</b> {msg.content}</p>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default ChatComponent;