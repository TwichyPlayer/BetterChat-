import React from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { SparkleIcon } from './Icons';

const AppBar: React.FC = () => {
  return (
    <Sheet
      component="header"
      variant="solid"
      color="primary"
      invertedColors
      sx={{
        py: 1.5,
        px: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ maxWidth: '800px', mx: 'auto' }}
      >
        <SparkleIcon />
        <Typography level="title-lg" component="h1">
          AI Assistant
        </Typography>
      </Stack>
    </Sheet>
  );
};

export default AppBar;