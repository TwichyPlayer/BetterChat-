import React from 'react';
import { marked } from 'marked';
import { ChatMessage, MessageSender, ToolCall } from '../types';
import WeatherWidget from './WeatherWidget';
import { SparkleIcon } from './Icons';

import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Avatar from '@mui/joy/Avatar';
import Typography from '@mui/joy/Typography';
import { keyframes } from '@emotion/react';

interface ChatMessageProps {
  message: ChatMessage;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  const animationSx = {
    animation: `${fadeIn} 0.3s ease-out`,
  };

  const renderContent = () => {
    if (typeof message.content === 'string') {
      const rawMarkup = marked.parse(message.content);
      return (
        <Sheet variant="soft" color="neutral" sx={{ p: 1.5, borderRadius: 'lg' }}>
          <Typography
            level="body-md"
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: rawMarkup }}
            sx={{
              '& a': { color: 'primary.300' },
              '& pre': { backgroundColor: 'background.level1' },
              '& code': { backgroundColor: 'background.level1' },
            }}
          />
        </Sheet>
      );
    }
    const toolCall = message.content as ToolCall;
    if (toolCall.tool === 'weather') {
      return <WeatherWidget data={toolCall.data} />;
    }
    return null;
  };

  if (isUser) {
    return (
      <Stack direction="row" justifyContent="flex-end" sx={animationSx}>
        <Sheet
          variant="solid"
          color="primary"
          sx={{
            p: 1.5,
            borderRadius: 'lg',
            maxWidth: '80%',
            wordBreak: 'break-word',
          }}
        >
          <Typography level="body-md" sx={{ color: 'common.white' }}>
            {message.content as string}
          </Typography>
        </Sheet>
      </Stack>
    );
  }

  // AI Message
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="flex-start"
      sx={{ ...animationSx, maxWidth: '80%' }}
    >
      <Avatar variant="soft">
        <SparkleIcon />
      </Avatar>
      <Stack spacing={1} sx={{ flex: 1 }}>
        {renderContent()}
      </Stack>
    </Stack>
  );
};

export default ChatMessageComponent;