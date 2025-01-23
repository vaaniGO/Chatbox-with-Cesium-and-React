import 'web-streams-polyfill'; // Ensure ReadableStream is available
import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const app = express();
const port = 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// Initialize Groq client
const client = new Groq({
  apiKey: process.env['GROQ_API_KEY'], // Ensure this environment variable is set
});

// Mapping of chatId to memory objects
const chatMemoryMap = {};

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, chatId } = req.body;

    if (!prompt || chatId === undefined) {
      return res.status(400).json({ error: 'Prompt and chatId are required' });
    }

    console.log('Received prompt:', prompt);
    console.log('Chat ID:', chatId);

    // Retrieve or create memory for the given chatId
    if (!chatMemoryMap[chatId]) {
      chatMemoryMap[chatId] = new BufferMemory({
        chatHistory: new ChatMessageHistory(), // New chat history for this chatId
      });
    }

    const memory = chatMemoryMap[chatId];
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

    // Add messages to the chat-specific memory
    await memory.chatHistory.addMessage(new HumanMessage(prompt));
    await memory.chatHistory.addMessage(new AIMessage(aiResponse));

    // Send the AI response back to the client
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Endpoint to delete a chat's memory
app.delete('/api/chat/:chatId', (req, res) => {
  const { chatId } = req.params;

  if (chatMemoryMap[chatId]) {
    delete chatMemoryMap[chatId];
    res.json({ success: true, message: `Chat ${chatId} memory deleted.` });
  } else {
    res.status(404).json({ error: 'Chat not found.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
