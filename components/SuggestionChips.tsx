import React from 'react';
import Grid from '@mui/joy/Grid';
import Button from '@mui/joy/Button';

interface SuggestionChipsProps {
  onChipClick: (suggestion: string) => void;
}

const suggestions = [
  "What are the advantages of using Next.js?",
  "Write code to demonstrate Dijkstra's algorithm",
  "Help me write an essay about Silicon Valley",
  "What is the weather in San Francisco?",
];

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onChipClick }) => {
  return (
    <Grid container spacing={1} sx={{ maxWidth: '800px', width: '100%', p:1 }}>
      {suggestions.map((text) => (
        <Grid key={text} xs={12} md={6}>
          <Button
            variant="outlined"
            color="neutral"
            fullWidth
            onClick={() => onChipClick(text)}
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              py: 1.5,
              fontWeight: 'normal',
            }}
          >
            {text}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default SuggestionChips;