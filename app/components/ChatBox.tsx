'use client';

import { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; text: string }[]
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
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
    <div className='fixed bottom-4 right-4 bg-white shadow-lg rounded-lg w-80 p-4'>
      <h2 className='font-bold mb-2 text-lg text-primary'>Chat with us</h2>
      <div className='h-48 overflow-y-auto text-sm space-y-1 mb-2'>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === 'user'
                ? 'text-right text-blue-700'
                : 'text-left text-gray-700'
            }
          >
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && <p className='text-gray-400 text-sm italic'>Typing...</p>}
      </div>
      <input
        className='border border-gray-300 p-1 text-sm w-full rounded'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder='Ask me anything...'
      />
      <button
        className='w-full mt-2 bg-primary text-white text-sm p-1 rounded hover:bg-primary-dark'
        onClick={handleSend}
        disabled={loading}
      >
        Send
      </button>
    </div>
  );
}
