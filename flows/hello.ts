import { defineFlow } from 'genkit';

export const helloFlow = defineFlow(
  {
    name: 'helloFlow',
    inputSchema: { name: 'string' },
  },
  async ({ name }) => {
    return `Hello, ${name}!`;
  }
);
