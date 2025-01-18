import React, { useState, useEffect, useRef } from 'react';
import CesiumMap from './cesiumMap.js';
import './App.css';
import ChatBox from './chatBox.js';

const App = () => {
  const [width, setWidth] = useState(75); // Percentage of width for the CesiumMap side

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
        <ChatBox />
      </div>
    </div>
  );
};

export default App;
