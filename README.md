# Chatbox-with-Cesium-and-React
Displays a cesium map and enables an LLM-chatbox using React, Resium, Cesium, Node.js

Stage 1:
1. The user may chat with the LLM (currently Groq) in the chatbox. The width for the map view and the chatbox is adjustable. 
<img width="1710" alt="Screenshot 2025-01-16 at 12 39 47 PM" src="https://github.com/user-attachments/assets/e06bd0f3-b26f-4f47-ab2c-06f6c3ef9d9e" />

Stage 2: 
1. Memory in the LLM
The below response of the LLM shows its memory. Currently memory is implemented using Langchain's memory modules, specifically BufferMemory.
<img width="1710" alt="Screenshot 2025-01-18 at 3 42 02 PM" src="https://github.com/user-attachments/assets/28ffaa38-5a66-4f35-891c-ee4854794226" />

2. Delete chat / New chat feature

Stage 3: 
1. Chat with the LLM about custom documents using RAG

Both the above features can be seen below: 
<img width="1710" alt="Screenshot 2025-01-23 at 11 04 26 PM" src="https://github.com/user-attachments/assets/2e1061b7-4ca6-4cce-9349-7d155a55257e" />

The architecture of the application at Stage 3 is the following: 
1. React frontend, map uses Cesium, binded using Resium
2. Node backend for LLM queries, interacting with fetch api, LLM used = Groq
3. Python backend for RAG context retrieval, using fast api, and interacting with fetch api
