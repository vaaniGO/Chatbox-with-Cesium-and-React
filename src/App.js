import React, { useState, useEffect, useRef } from 'react';
import CesiumMap from './cesiumMap.js';
import './App.css';

const App = () => {
  const [width, setWidth] = useState(75); // Percentage of width for the CesiumMap side
  const [messages, setMessages] = useState([]); // Chat history
  const [userInput, setUserInput] = useState(''); // User's input message
  const chatboxRef = useRef(null); // Reference to the chatbox

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
  
    // Add user input to messages
    setMessages((prev) => [...prev, { sender: 'User', text: userInput }]);
  
    // Call LLM API
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput }), // This matches the server's expected format
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
  
      // Add LLM response to messages
      setMessages((prev) => [...prev, { sender: 'LLM', text: data.response }]);
    } catch (error) {
      console.error('Error communicating with LLM:', error);
      setMessages((prev) => [...prev, { sender: 'LLM', text: 'Error: Unable to get response.' }]);
    }
  
    // Clear user input
    setUserInput('');
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const isResizing = useRef(false); // Track whether resizing is in progress
  const currentWidth = useRef(width); // Store the current width during resizing

  const handleMouseDown = (e) => {
    isResizing.current = true;
    const startX = e.clientX;

    const handleMouseMove = (e) => {
      if (!isResizing.current) return;

      const deltaX = e.clientX - startX;
      const newWidth = Math.max(10, Math.min(currentWidth.current + (deltaX / window.innerWidth) * 100, 90)); // Limit between 10% and 90%
      currentWidth.current = newWidth;
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="split-container">
      <div className="left-panel" style={{ width: `${width}%` }}>
        <CesiumMap />
      </div>
      <div className="divider" onMouseDown={handleMouseDown} />
      <div className="right-panel" style={{ width: `${100 - width}%` }}>
        <div className="chatbox-header">Chat</div>
        <div className="chatbox">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={msg.sender === 'User' ? 'chat-message-user' : 'chat-message-llm'}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="chatbox-query-input">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message here..."
          />
          <button onClick={handleSendMessage}>
            <i className="fa-regular fa-paper-plane" style={{ color: `#ffffff` }}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
