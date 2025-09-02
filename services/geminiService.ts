import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const weatherSchema = {
    type: Type.OBJECT,
    properties: {
        location: { type: Type.STRING, description: "The city and state, e.g., San Francisco, CA" },
        currentTemp: { type: Type.NUMBER, description: "Current temperature in Celsius." },
        high: { type: Type.NUMBER, description: "Today's high temperature in Celsius." },
        low: { type: Type.NUMBER, description: "Today's low temperature in Celsius." },
        description: { type: Type.STRING, description: "A short, one or two word description of the current weather, e.g., 'Sunny' or 'Partly Cloudy'." },
        feelsLike: { type: Type.NUMBER, description: "The 'feels like' temperature in Celsius." },
        hourly: {
            type: Type.ARRAY,
            description: "A 5-hour forecast, with each hour represented.",
            items: {
                type: Type.OBJECT,
                properties: {
                    time: { type: Type.STRING, description: "The hour, e.g., '1PM'" },
                    temp: { type: Type.NUMBER, description: "Temperature in Celsius for that hour." },
                    icon: { type: Type.STRING, description: "A valid Google Material Icons Outlined name for the weather, e.g., 'wb_sunny', 'partly_cloudy_day', 'cloud'."},
                    description: { type: Type.STRING, description: "A short, one or two word description for the hour's weather, e.g., 'Sunny'." }
                },
                required: ['time', 'temp', 'icon', 'description']
            }
        }
    },
    required: ['location', 'currentTemp', 'high', 'low', 'description', 'feelsLike', 'hourly']
};


const responseSchema = {
    type: Type.OBJECT,
    properties: {
        reply: {
            type: Type.STRING,
            description: "A friendly, conversational text response to the user's query. This must always be present."
        },
        // Fix: The `nullable` property is not supported in Gemini's response schema.
        // Instructing the model to omit the field is the correct way to make it optional,
        // as `weatherData` is not in the `required` array.
        weatherData: {
            ...weatherSchema,
            description: "Weather data, only if the user explicitly asks about the weather. Otherwise, this field should be omitted."
        }
    },
    required: ['reply']
};

const systemInstruction = `
You are a helpful and friendly AI assistant. Your goal is to provide accurate information and engage the user. 
You have access to a special tool to display weather information. 
When a user asks about the weather, you MUST populate the 'weatherData' field with realistic-looking data, including a 5-hour forecast.
For ALL requests, you MUST also populate the 'reply' field with a friendly, conversational text message.
You can and should use Markdown for formatting your response (e.g., lists, code blocks, bold, italics) to improve readability.
`;

export const getAiResponse = async (prompt: string): Promise<{ reply: string; weatherData: WeatherData | null }> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const text = response.text.trim();
    const data = JSON.parse(text);

    return {
        reply: data.reply || "",
        weatherData: data.weatherData || null
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
        reply: "I'm having trouble connecting right now. Please try again later.",
        weatherData: null,
    };
  }
};
