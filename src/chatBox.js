import React, { useState, useEffect, useRef } from 'react';

const ChatBox = () => {
    const [messages, setMessages] = useState([]); // Chat history
    const [userInput, setUserInput] = useState(''); // User's input message
    const chatboxRef = useRef(null); // Reference to the chatbox

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

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

    return (
        <div className="chatbox-wrapper">
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
    )
};

export default ChatBox;