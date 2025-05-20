import { NextResponse } from 'next/server';




export const POST = async (request: Request) => {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // Simulate a chat response
    const chatResponse = `Hello from AI ${message}`;

    return NextResponse.json({ response: chatResponse });
    
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    
  }
}