import React from 'react';
import { WeatherData } from '../types';

import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';

interface WeatherWidgetProps {
  data: WeatherData;
}

const getWeatherIcon = (description: string): string => {
  if (!description) return 'thermostat';
  const lowerDesc = description.toLowerCase();

  if (lowerDesc.includes('sun') || lowerDesc.includes('clear')) return 'wb_sunny';
  if (lowerDesc.includes('partly cloudy') || lowerDesc.includes('few clouds')) return 'partly_cloudy_day';
  if (lowerDesc.includes('cloud')) return 'cloud';
  if (lowerDesc.includes('rain') || lowerDesc.includes('drizzle') || lowerDesc.includes('shower')) return 'rainy';
  if (lowerDesc.includes('storm') || lowerDesc.includes('thunder')) return 'thunderstorm';
  if (lowerDesc.includes('snow') || lowerDesc.includes('flurr')) return 'ac_unit';
  if (lowerDesc.includes('mist') || lowerDesc.includes('fog') || lowerDesc.includes('haze')) return 'foggy';

  return 'thermostat'; // Default icon
};

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const { location, currentTemp, high, low, hourly, description, feelsLike } = data;
  const mainIcon = getWeatherIcon(description || '');

  return (
    <Card variant="outlined" sx={{ width: '100%', maxWidth: '450px' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography level="h4" noWrap>
              {location || 'Unknown Location'}
            </Typography>
            <Typography level="body-md" textColor="text.secondary">
              {description || 'No description'}
            </Typography>
          </Box>
          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <span
              className="material-icons-outlined"
              style={{ fontSize: '3rem', color: '#90caf9' /* primary[200] */ }}
            >
              {mainIcon}
            </span>
            <Typography level="h1" component="div">
              {currentTemp ?? 'N/A'}°
            </Typography>
          </Stack>
        </Stack>
        <Typography level="body-sm" textColor="text.tertiary" sx={{ mt: 0.5, mb: 2 }}>
          H:{high ?? 'N/A'}° L:{low ?? 'N/A'}° • Feels like: {feelsLike ?? 'N/A'}°
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="space-between">
          {hourly?.slice(0, 5).map((hour, index) => (
            <Sheet
              key={index}
              variant="soft"
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'md',
                p: 1,
                gap: 0.5,
              }}
            >
              <Typography level="body-xs" textColor="text.secondary">
                {hour.time || 'N/A'}
              </Typography>
              <span
                className="material-icons-outlined"
                style={{ fontSize: '1.75rem', color: '#90caf9' }}
              >
                {getWeatherIcon(hour.description || '') || 'help_outline'}
              </span>
              <Typography level="title-sm">{hour.temp ?? 'N/A'}°</Typography>
            </Sheet>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;