import { NextResponse } from 'next/server';



import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;


const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});












export const POST = async (request: Request) => {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // Simulate a chat response
    const chatResponseFromAI = await llm.invoke([{ role: "user", content: "Hi im bob" }]);


    const chatResponse = `Hello from AI ${chatResponseFromAI.content}`;
    console.log('Chat response:', chatResponse);

    return NextResponse.json({ response: chatResponse });
    
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    
  }
}