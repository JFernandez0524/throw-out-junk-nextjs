'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Button,
  TextField,
  Flex,
  Text,
  Card,
  Loader,
  ScrollView,
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

// Helper function for the retry delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt || isLoading) return;

    const currentPrompt = prompt;
    const newMessages: Message[] = [
      ...messages,
      { sender: 'user', text: currentPrompt },
    ];

    setMessages(newMessages);
    setPrompt('');
    setIsLoading(true);

    // Build the conversation context
    const systemPrompt =
      "You are a friendly, expert junk removal assistant for a company called 'Throw Out My Junk'. You are conversational and not overly verbose. When a user asks about pricing or services, always mention you need their address first to give an accurate quote.\n\n";
    const historyString = newMessages
      .slice(-4)
      .map(
        (msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
      )
      .join('\n');
    const fullPrompt = systemPrompt + historyString;

    // Implement retry logic for throttling
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch('/api/v1/chat/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: fullPrompt }),
        });

        if (response.status === 429) {
          throw new Error('ThrottlingException');
        }

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        setMessages((prev) => [...prev, { sender: 'ai', text: data.response }]);
        break; // Exit the loop if successful
      } catch (e: any) {
        attempts++;
        if (e.message === 'ThrottlingException' && attempts < maxAttempts) {
          const delay = Math.pow(2, attempts) * 200; // e.g., 200ms, 400ms, 800ms
          console.log(`Throttled. Retrying in ${delay}ms...`);
          await sleep(delay);
        } else {
          console.error('Failed to send message after multiple retries:', e);
          setMessages((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: 'Sorry, a network error occurred. Please try again.',
            },
          ]);
          break; // Exit loop after final failure
        }
      }
    }

    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className='fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 z-50'
      >
        Chat with us
      </button>
    );
  }

  return (
    <div className='fixed bottom-4 right-4 w-96 h-[600px] bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col z-50'>
      <ScrollView height='100%' width='100%'>
        <Flex direction='column' className='h-full'>
          <Text className='p-4 font-bold border-b flex-shrink-0'>
            Chat with JunkBot
          </Text>
          <Flex
            direction='column'
            gap='small'
            className='p-4 flex-grow overflow-y-auto min-h-0'
          >
            {messages.map((msg, index) => (
              <Card
                key={index}
                variation={msg.sender === 'ai' ? 'elevated' : 'outlined'}
              >
                <Text>{msg.text}</Text>
              </Card>
            ))}
            {isLoading && <Loader />}
          </Flex>
          <Flex
            as='form'
            direction='row'
            gap='small'
            className='p-4 border-t flex-shrink-0'
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <TextField
              label='Chat message'
              labelHidden={true}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Ask a question...'
              className='flex-grow'
              isDisabled={isLoading}
            />
            <Button type='submit' variation='primary' isLoading={isLoading}>
              Send
            </Button>
          </Flex>
        </Flex>
      </ScrollView>
      <button
        onClick={() => setIsOpen(false)}
        className='w-full bg-gray-200 text-black p-2 rounded-b-lg hover:bg-gray-300 absolute bottom-0'
      >
        Close
      </button>
    </div>
  );
}
