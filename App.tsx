import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageSender } from './types';
import ChatInput from './components/ChatInput';
import ChatMessageComponent from './components/ChatMessage';
import SuggestionChips from './components/SuggestionChips';
import { getAiResponse } from './services/geminiService';
import { SparkleIcon } from './components/Icons';
import AppBar from './components/AppBar';

import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircularProgress from '@mui/joy/CircularProgress';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: MessageSender.USER,
      content: text,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { reply, weatherData } = await getAiResponse(text);

      if (weatherData) {
        const weatherMessage: ChatMessage = {
          id: Date.now().toString() + '-weather',
          sender: MessageSender.AI,
          content: {
            tool: 'weather',
            data: weatherData,
          },
        };
        setMessages(prev => [...prev, weatherMessage]);
      }
      
      if (reply) {
        const aiMessage: ChatMessage = {
          id: Date.now().toString() + '-text',
          sender: MessageSender.AI,
          content: reply,
        };
        setMessages(prev => [...prev, aiMessage]);
      }

    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        sender: MessageSender.AI,
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const InitialView = () => (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{ flex: 1, p: 2, textAlign: 'center' }}
    >
      <SparkleIcon className="text-5xl text-primary-400" />
      <Typography level="h1">Hello there!</Typography>
      <Typography level="title-lg" textColor="text.secondary">
        How can I help you today?
      </Typography>
      <SuggestionChips onChipClick={handleSendMessage} />
    </Stack>
  );

  const ChatView = () => (
     <Stack
      spacing={3}
      sx={{
        flex: 1,
        p: 2,
        maxWidth: '800px',
        width: '100%',
        mx: 'auto',
      }}
    >
      {messages.map((msg) => (
        <ChatMessageComponent key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar variant="soft">
            <SparkleIcon />
          </Avatar>
          <Sheet
            variant="soft"
            color="neutral"
            sx={{ p: 1.5, borderRadius: 'lg' }}
          >
            <CircularProgress size="sm" />
          </Sheet>
        </Stack>
      )}
      <div ref={scrollRef} />
    </Stack>
  );

  return (
    <Sheet
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none', // Hide scrollbar for Chrome, Safari, and Opera
            },
            scrollbarWidth: 'none', // Hide scrollbar for Firefox
            msOverflowStyle: 'none', // Hide scrollbar for IE and Edge
          }}
        >
          {messages.length === 0 && !isLoading ? <InitialView /> : <ChatView />}
        </Box>
      </Box>
      <Sheet
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.body',
        }}
      >
        <Box sx={{ maxWidth: '800px', p: 2, mx: 'auto' }}>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </Box>
      </Sheet>
    </Sheet>
  );
};

export default App;