import { NextResponse } from 'next/server';



import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
  Annotation,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from 'uuid';
import { ChatPromptTemplate } from "@langchain/core/prompts";



const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});


// Define the function that calls the model
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const response = await llm.invoke(state.messages);
  return { messages: response}

}


// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);


// Add memory 
const app = workflow.compile({checkpointer: new MemorySaver()});

// For each user, same config
const config = { configurable: { thread_id: uuidv4() } };






/// prompt with messages ------------------------2nd-------------------
const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You talk like a pirate. Answer all questions to the best of your ability.",
  ],
  ["placeholder", "{messages}"],
]);


// Define the function that calls the model 
const callModel2 = async (state: typeof MessagesAnnotation.State) => {
  const prompt = await promptTemplate.invoke(state);
  const response = await llm.invoke(prompt);
  // Update message history with response:
  return { messages: [response] };
};

// Define a new graph
const workflow2 = new StateGraph(MessagesAnnotation)
  // Define the (single) node in the graph
  .addNode("model", callModel2)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add memory
const app2 = workflow2.compile({ checkpointer: new MemorySaver() });







// prompt with language and messages ------------------------3rd-------------------
const promptTemplate2 = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
  ],
  ["placeholder", "{messages}"],
]);


// Define the State
const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  language: Annotation<string>(),
});

// Define the function that calls the model
const callModel3 = async (state: typeof GraphAnnotation.State) => {
  const prompt = await promptTemplate2.invoke(state);
  const response = await llm.invoke(prompt);
  return { messages: [response] };
};

const workflow3 = new StateGraph(GraphAnnotation)
  .addNode("model", callModel3)
  .addEdge(START, "model")
  .addEdge("model", END);

const app3 = workflow3.compile({ checkpointer: new MemorySaver() });






export const POST = async (request: Request) => {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // const input = [{ role: "user", content: message }];
    const input = {messages: [{ role: "user", content: message }], language: "Bangla"};

    // Chat response from AI
    //const chatResponseFromAI = await app.invoke({messages: input}, config);
    // const chatResponseFromAI = await app2.invoke({ messages: input }, config);
    const chatResponseFromAI = await app3.invoke(input, config);



    // Normalize messages to array of objects with role/content
    let messagesArr = chatResponseFromAI.messages;
    if (!Array.isArray(messagesArr)) {
      messagesArr = [messagesArr];
    }
    // Try to infer role if missing (Gemini may not set role)
    const aiMsg = messagesArr.reverse().find((msg: any) => (msg.role === 'assistant') || (!msg.role && msg.content));
    console.log("Latest AI message:", aiMsg);



    if (!aiMsg) {
      return NextResponse.json({ response: "No response." });
    }

    return NextResponse.json({ response: aiMsg.content });
    
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    
  }
}