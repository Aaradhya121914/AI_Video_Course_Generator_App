import {GoogleGenerativeAI,HarmCategory,HarmBlockThreshold} from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI=new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview'});

const generationConfig = {
  temperature:1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens:8192,
  responseMimeType:"application/json",
};

export const GenerateCourseLayout_AI =model.startChat({
  generationConfig,
  history:[
    {
      role:"user",
      parts:[
        {
          text:"Generate A Course tutorial on following detail with course field name,description,along with chapter name, about, duration:"
        }
      ],
    },
    {
      role:"model",
      parts:[
        {
          text:"```json\n {\n \"course\":{\n \"name\":\"Course Name\",\n \"description\":\"Course Description\",\n \"chapters\":[\n {\n \"name\":\"Chapter 1\",\n \"about\":\"Chapter 1 Description\",\n \"duration\":\"Duration of Chapter 1\"\n },\n {\n \"name\":\"Chapter 2\",\n \"about\":\"Chapter 2 Description\",\n \"duration\":\"Duration of Chapter 2\"\n }\n ]\n }\n}\n```"
        }
      ],
    },
  ],
  
});

export const GenerateChapterContent_AI = async (prompt) => {
  const chat = model.startChat({
    generationConfig,
    history: [],
  });

  return chat.sendMessage(prompt);
};

