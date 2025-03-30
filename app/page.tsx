'use client';

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import outputs from '@/amplify_outputs.json';

// Import components
import Hero from '@/app/components/Hero';
import Services from '@/app/components/Services';
import WhyChooseUs from '@/app/components/WhyChooseUs';
import Testimonials from '@/app/components/Testimonials';
import CTA from '@/app/components/CTA';
import FAQ from '@/app/components/FAQ';

// Configure Amplify and generate the client
Amplify.configure(outputs);
const client = generateClient<Schema>();
import { useAuthenticator } from '@aws-amplify/ui-react';

// App component
export default function App() {
  //Code from the tutorial
  // const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([]);

  // // List all todos
  // function listTodos() {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }

  // // Fetch todos on mount
  // useEffect(() => {
  //   listTodos();
  // }, []);

  // // Create a new todo
  // function createTodo() {
  //   client.models.Todo.create({
  //     content: window.prompt('Todo content'),
  //   });
  // }

  // // Delete a todo
  // function deleteTodo(id: string) {
  //   client.models.Todo.delete({ id });
  // }

  return (
    <main>
      <Hero />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
