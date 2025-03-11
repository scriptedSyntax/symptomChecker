import React, { useState, useEffect, useRef } from "react";
import "./ChatInterface.css";
import userIcon from "../assets/user-icon.png";
import botIcon from "../assets/bot-icon.png";

const ChatInterface = ({ onSendMessage, messages }) => {
  const [message, setMessage] = useState("");
  const [isFirstMessageSent, setIsFirstMessageSent] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    if (!isFirstMessageSent) {
      setIsFirstMessageSent(true);
    }

    onSendMessage(message);
    setMessage("");
  };

  return (
    <div className={`chat-container ${isFirstMessageSent ? "moved-down" : "centered"}`}>
      <h2 className="chat-title">Ask about your Symptoms</h2>
      <div className="chat-messages">
        {!isFirstMessageSent && (
          <div className="chat-disclaimer">
            This tool is for informational purposes only. It does not provide medical advice. If symptoms persist, consult a doctor.
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            <img
              src={msg.sender === "user" ? userIcon : botIcon}
              alt="avatar"
              className="chat-avatar"
            />
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your symptoms..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;
