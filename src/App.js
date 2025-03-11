import React, { useState } from "react";
import ChatInterface from "./components/ChatInterface";
import { getSymptomAnalysis } from "./services/geminiApi";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (userMessage) => {
    const newMessages = [...messages, { text: userMessage, sender: "user" }];
    setMessages(newMessages);
    setIsTyping(true);

    const botResponse = await getSymptomAnalysis(userMessage);
    setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
    setIsTyping(false);
  };

  return (
    <div className="App">
      <nav className="navbar">
      <div className="logo" href="">
  <a href="https://github.com/scriptedSyntax" rel="noopener noreferrer">By Samuel Mwangi</a>
</div>

        <ul className="nav-links">
          <li><a href="https://www.fiverr.com/sellers/the_sketchb00k">Fiverr</a></li>
          <li className="nav-divider">|</li>
          <li><a href="https://github.com/scriptedSyntax/scriptedSyntax">Github</a></li>
        </ul>
      </nav>

      <ChatInterface onSendMessage={handleSendMessage} messages={messages} />
      {isTyping && <p className="typing-indicator">Symptom Checker is thinking...</p>}
    </div>
  );
};

export default App;
<div className="navbar">
<a href="https://github.com/scriptedSyntax" target="_blank" rel="noopener noreferrer">Symptom Checker</a>
</div>