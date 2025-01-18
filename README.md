# Chatbox-with-Cesium-and-React
Displays a cesium map and enables an LLM-chatbox using React, Resium, Cesium, Node.js

Stage 1:
The user may chat with the LLM (currently Groq) in the chatbox. The width for the map view and the chatbox is adjustable. 
<img width="1710" alt="Screenshot 2025-01-16 at 12 39 47 PM" src="https://github.com/user-attachments/assets/e06bd0f3-b26f-4f47-ab2c-06f6c3ef9d9e" />

Stage 2: 
1. Memory in the LLM
The below response of the LLM shows its memory. Currently memory is implemented using Langchain's memory modules, specifically BufferMemory.
<img width="1710" alt="Screenshot 2025-01-18 at 3 42 02 PM" src="https://github.com/user-attachments/assets/28ffaa38-5a66-4f35-891c-ee4854794226" />

3. Delete chat / New chat feature

Stage 3: 
1. Chat with the LLM about the map
