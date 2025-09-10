```ts
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1', 
  apiKey: 'your-api-key'
});

const response = await openai.chat.completions.create({
  model: 'openai/gpt-5-nano',
  messages: [
    {role: 'user', content: 'Your prompt here'}
  ],
  stream: true, // Enable streaming
  reasoning: {  // Configure reasoning tokens
    effort: 'medium', // Can be 'high', 'medium', or 'low'
    exclude: false // Set to true to hide reasoning from response
  }
});

// Process the streamed response
for await (const chunk of response) {
  if (chunk.choices[0].delta.reasoning) {
    console.log('REASONING:', chunk.choices[0].delta.reasoning);
  } else if (chunk.choices[0].delta.content) {
    console.log('CONTENT:', chunk.choices[0].delta.content);
  }
}

```