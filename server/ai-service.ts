import OpenAI from 'openai';

let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error('OpenAI API key not configured');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
}

export class AIService {
  // Generate questions from study material content
  static async generateQuestions(
    content: string, 
    subject: string, 
    count: number = 5
  ): Promise<GeneratedQuestion[]> {
    try {
      const prompt = `
Based on the following study material, generate ${count} multiple-choice questions.

CONTENT:
${content}

REQUIREMENTS:
- Create questions that test understanding of key concepts
- Mix difficulty levels: beginner, intermediate, advanced
- Each question should have 4 options (A, B, C, D)
- Clearly indicate the correct answer
- Subject area: ${subject}

FORMAT your response as a JSON array like this:
[
  {
    "question": "What is the main function of...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 1,
    "difficulty": "beginner",
    "subject": "${subject}"
  }
]

Generate exactly ${count} questions:`;

      const completion = await getOpenAIClient().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert educator who creates high-quality multiple-choice questions. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI');
      }

      // Parse the JSON response
      const questions = JSON.parse(response);
      return questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate questions');
    }
  }

  // AI Tutor chat functionality
  static async tutorChat(
    userMessage: string,
    studyMaterialContent?: string,
    chatHistory?: Array<{role: string, content: string}>
  ): Promise<string> {
    try {
      const systemPrompt = `You are an AI tutor helping students understand their study materials. 
Be helpful, encouraging, and educational. Explain concepts clearly and provide examples when helpful.
${studyMaterialContent ? `\n\nCONTEXT FROM STUDENT'S MATERIAL:\n${studyMaterialContent}` : ''}`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...(chatHistory || []),
        { role: "user", content: userMessage }
      ];

      const completion = await getOpenAIClient().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI tutor');
      }

      return response;
    } catch (error) {
      console.error('Error in tutor chat:', error);
      throw new Error('Failed to get tutor response');
    }
  }

  // Summarize study material
  static async summarizeContent(content: string, subject: string): Promise<string> {
    try {
      const prompt = `Summarize the following ${subject} study material in a clear, concise way. 
Highlight the key concepts and main points:

${content}`;

      const completion = await getOpenAIClient().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at creating clear, educational summaries."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 800,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI');
      }

      return response;
    } catch (error) {
      console.error('Error summarizing content:', error);
      throw new Error('Failed to summarize content');
    }
  }
} 