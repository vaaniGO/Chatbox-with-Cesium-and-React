import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBox = () => {
  const [messages, setMessages] = useState([]); // Chat history
  const [userInput, setUserInput] = useState(''); // User's input message
  const [chats, setChats] = useState([]); // Array to store all chats
  const [currentChatId, setCurrentChatId] = useState(0); // Current active chat ID
  const [showPreviousChats, setShowPreviousChats] = useState(false); // Toggle for previous chats list
  const chatboxRef = useRef(null); // Reference to the chatbox
  const chromaClient = 'http://127.0.0.1:8000/';

  // Scroll to the bottom of the chat when messages are updated
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
  
    // Add user input to messages
    setMessages((prev) => [...prev, { sender: 'User', text: userInput }]);
  
    try {
      // Fetch RAG data
      const ragResponse = await fetch(`http://127.0.0.1:8000/query?query=${encodeURIComponent(userInput)}`);
      const ragData = await ragResponse.json();
  
      // Construct the complete prompt with RAG context
      const completePrompt = `Context: ${JSON.stringify(ragData.results)}\n\nQuestion: ${userInput}`;
  
      // Send the prompt and currentChatId to the server
      const response = await fetch(`http://localhost:3000/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: completePrompt, 
          chatId: currentChatId 
        }),
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
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

  const handleAddNewChat = () => {
    console.log(currentChatId)
    console.log(chats.length)
    // If we are on the current (latest) chat, only then append it to saved messages, 
    // else if we are on some previous chat, do not re-append it to saved messages
    if (currentChatId == chats.length && messages.length > 0) {
      setChats((prevChats) => [
        ...prevChats,
        { id: currentChatId, messages: [...messages] },
      ]);
    }

    // Start a new chat
    setMessages([]);
    setCurrentChatId((prevId) => prevId + 1);
  };

  const togglePreviousChats = () => {
    setShowPreviousChats((prev) => !prev);
  };

  const selectPreviousChat = (chatId) => {
    const selectedChat = chats.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setCurrentChatId(chatId);
    }
    setShowPreviousChats(false); // Close the list after selecting a chat
  };

  const handleDeleteChat = (chatId) => {
    // Filter out the chat with the specified chatId
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
  
    // If the deleted chat is the current chat, reset the messages and set the current chat to a new state
    if (chatId === currentChatId) {
      setMessages([]);
      setCurrentChatId(0); // Reset to the default chat or the next available chat
    }
  };

  return (
    <div className="chatbox-wrapper">
      <div className="chatbox-header">
        <div className="previousChatNav">
          <i
            onClick={togglePreviousChats}
            className="fa-solid fa-bars"
            style={{ color: 'white' }}
          ></i>
        </div>
        Chat
        <div className="addNewChat">
          <i
            onClick={handleAddNewChat}
            className="fa-solid fa-plus"
            style={{ color: '#ffffff' }}
          ></i>
        </div>
      </div>

      {showPreviousChats && (
        <div className="previous-chats-list">
          <h3>Previous Chats</h3>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                className="previous-chat"
                onClick={() => selectPreviousChat(chat.id)}
                style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ccc' }}
              >
                <div className='previous-chat-chatNumber'>
                Chat {chat.id + 1}
                </div>
                <div
                  className="previous-chat-delete"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent selecting the chat when clicking delete
                    handleDeleteChat(chat.id);
                  }}
                >
                  Delete
                </div>
              </div>
            ))
          ) : (
            <p>No previous chats available</p>
          )}
        </div>
      )}

      <div className="chatbox" ref={chatboxRef}>
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
  );
};

export default ChatBox;
