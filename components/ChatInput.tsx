import React, { useState } from 'react';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Send a message..."
        disabled={isLoading}
        sx={{ '--Input-decoratorChildHeight': '36px', borderRadius: 'xl' }}
        endDecorator={
          <IconButton
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            variant="solid"
            color="primary"
            sx={{ borderRadius: '50%' }}
            aria-label="Send message"
          >
            <span className="material-icons-outlined">arrow_upward</span>
          </IconButton>
        }
        aria-label="Chat input"
      />
    </form>
  );
};

export default ChatInput;