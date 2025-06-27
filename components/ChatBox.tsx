'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatContext } from '@/context/ChatContext';

export default function ChatBox() {
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; text: string }[]
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // inside ChatBox component
  const { showChat, setShowChat } = useChatContext();

  useEffect(() => {
    const id = localStorage.getItem('chat_session_id') || crypto.randomUUID();
    localStorage.setItem('chat_session_id', id);
    setSessionId(id);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, sessionId }),
      });

      const data = await res.json();
      const botMessage = { role: 'ai' as const, text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Inline prompt - place this below your hero/header */}
      {!showChat && (
        <div className='flex justify-center mt-6'>
          <input
            type='text'
            placeholder='How can we help you?'
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                setInput(e.currentTarget.value);
                setShowChat(true);
                e.currentTarget.value = '';
              }
            }}
            className='border p-2 rounded shadow-md w-full max-w-md text-sm'
          />
        </div>
      )}

      {/* Floating button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className='fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 flex items-center justify-center text-xl z-50'
        >
          💬
        </button>
      )}

      {/* Chat Dialog */}
      {showChat && (
        <div className='fixed bottom-20 right-6 w-80 max-h-[70vh] bg-white border border-gray-300 rounded-lg shadow-2xl flex flex-col z-50'>
          {/* Header */}
          <div className='bg-green-600 text-white p-3 rounded-t-lg flex justify-between items-center'>
            <span className='font-semibold'>Chat with us</span>
            <button
              onClick={() => setShowChat(false)}
              className='text-white hover:text-gray-200 text-sm'
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className='flex-1 p-3 overflow-y-auto text-sm space-y-2'>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded px-3 py-2 max-w-[75%] ${
                    msg.role === 'user'
                      ? 'bg-blue-100 text-right'
                      : 'bg-gray-100 text-left'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <p className='text-gray-400 italic text-xs'>Typing...</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className='p-2 border-t flex gap-2'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder='Type your message...'
              className='flex-1 border border-gray-300 rounded p-2 text-sm'
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className='bg-green-600 text-white px-4 rounded hover:bg-green-700 text-sm'
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
