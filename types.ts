export enum MessageSender {
  USER = 'user',
  AI = 'ai',
}

export interface WeatherData {
  location: string;
  currentTemp: number;
  high: number;
  low: number;
  description: string;
  feelsLike: number;
  hourly: {
    time: string;
    temp: number;
    icon: string; // Material Icon name, e.g., 'wb_sunny'
    description: string; // A short description for the hour, e.g., 'Sunny'
  }[];
}

export interface ToolCall {
  tool: 'weather';
  data: WeatherData;
}

export type MessageContent = string | ToolCall;

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: MessageContent;
}