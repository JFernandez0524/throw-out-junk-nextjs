'use client';

import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<string | null>(null);

  // Load chat history when the user logs in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // const authUser = await Auth.currentAuthenticatedUser();
        const { user } = useAuthenticator();
        if (user) {
          setUser(user.username);
          const savedSession = localStorage.getItem(
            `chat-session-${user.username}`
          );
          const savedMessages = localStorage.getItem(
            `chat-messages-${user.username}`
          );

          if (savedSession) setSessionId(savedSession);
          if (savedMessages) setMessages(JSON.parse(savedMessages));
        }
      } catch {
        console.log('No user logged in');
      }
    };

    fetchUser();
  }, []);

  // Save chat history when messages update
  useEffect(() => {
    if (user) {
      localStorage.setItem(`chat-messages-${user}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Append user message
    const newMessages: Message[] = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: input }),
      });

      const data = await res.json();
      if (data.response) {
        setMessages([...newMessages, { role: 'ai', text: data.response }]);
        if (!sessionId) {
          setSessionId(data.sessionId);
          if (user)
            localStorage.setItem(`chat-session-${user}`, data.sessionId);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#007bff',
          color: 'white',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        💬
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '300px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            padding: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Chatbot</strong>
            <button
              onClick={() => setIsOpen(false)}
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              ❌
            </button>
          </div>

          <div
            style={{
              maxHeight: '250px',
              overflowY: 'auto',
              padding: '10px',
              border: '1px solid #ccc',
            }}
          >
            {messages.map((msg, index) => (
              <p
                key={index}
                style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}
              >
                <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>{' '}
                {msg.text}
              </p>
            ))}
          </div>

          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type a message...'
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          <button
            onClick={handleSendMessage}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            Send
          </button>
        </div>
      )}
    </>
  );
}
