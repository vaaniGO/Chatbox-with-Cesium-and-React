import 'web-streams-polyfill'; // Ensure ReadableStream is available
import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// Initialize Groq client
const client = new Groq({
  apiKey: process.env['GROQ_API_KEY'], // Ensure this environment variable is set
});

let memory = new BufferMemory({
  chatHistory: new ChatMessageHistory(), // Initial empty chat history
});


app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Received prompt:', prompt);

    const pastMessages = memory.chatHistory.messages;

    const messages = [
      ...pastMessages.map((msg) =>
        msg.role === 'human'
          ? { role: 'user', content: msg.content }
          : { role: 'assistant', content: msg.content }
      ),
      { role: 'user', content: prompt },
    ];

    
    const chatCompletion = await client.chat.completions.create({
      messages,
      model: 'llama3-8b-8192', 
    });

    const aiResponse = chatCompletion.choices[0].message.content;

    // Add messages to the temporary memory (optional)
    await memory.chatHistory.addMessage(new HumanMessage(prompt));
    await memory.chatHistory.addMessage(new AIMessage(aiResponse));

    // Send the AI response back to the client
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
