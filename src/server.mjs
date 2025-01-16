import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

const client = new Groq({
  apiKey: process.env['GROQ_API_KEY'], // This is the default and can be omitted
});

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(typeof(prompt))
    console.log('Received prompt:', prompt);  // Remove .text since prompt is already the text
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
    });

    res.json({ response: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
