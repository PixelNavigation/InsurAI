import { useState } from 'react';
import "./aiAssistant.css";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your InsureBuddy AI assistant. How can I help you today?", isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const updatedMessages = [
      ...messages,
      { text: inputText, isUser: true }
    ];
    setMessages(updatedMessages);
    setInputText('');
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let response = "I'm sorry, I don't have enough information to answer that question. Can you provide more details?";
      
      // Simple pattern matching for common insurance questions
      const lowercaseInput = inputText.toLowerCase();
      // Call backend API for AI response
      fetch('http://localhost:5000/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText })
      })
        .then(res => res.json())
        .then(data => {
          response = data.reply || response;
          setMessages([...updatedMessages, { text: response, isUser: false }]);
        })
        .catch(() => {
          setMessages([...updatedMessages, { text: response, isUser: false }]);
        });
      return; // Prevents running the local pattern matching below

      // --- fallback local pattern matching (optional, can remove if always using backend) ---
      if (lowercaseInput.includes('claim') && lowercaseInput.includes('status')) {
        response = "You can check your claim status in the 'Recent Claims' section of your dashboard. If you need more details, please click on 'View Details' next to the specific claim.";
      } else if (lowercaseInput.includes('risk score') || lowercaseInput.includes('improve score')) {
        response = "To improve your risk score, consider implementing the recommendations shown in the 'Recommendations' section, such as installing home security or taking a defensive driving course.";
      } else if (lowercaseInput.includes('file') && lowercaseInput.includes('claim')) {
        response = "To file a new claim, click on the 'File New Claim' button in the Recent Claims section of your dashboard.";
      } else if (lowercaseInput.includes('premium') || lowercaseInput.includes('payment')) {
        response = "You can view your premium details and make payments through the 'My Policies' section. Would you like me to guide you through the payment process?";
      }
      
      setMessages([...updatedMessages, { text: response, isUser: false }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="ai-assistant-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-title">InsureBuddy Assistant</div>
            <button className="close-button" onClick={toggleChat}>×</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="message ai-message typing">
                <span className="typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              </div>
            )}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask me anything about insurance..."
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
      <button className="chat-button" onClick={toggleChat}>
        {isOpen ? (
          "×"
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default AIAssistant;