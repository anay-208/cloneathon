import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { Message } from "@ai-sdk/react";
import { createChat, addMessageToChat } from "@/lib/actions/chat";
import prisma from "@/lib/db";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    console.log(json)
    const { messages, id } = json as { messages: Message[]; id?: string };
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage) {
      return new Response("No message provided", { status: 400 });
    }


    const session = await auth.api.getSession({
      headers: await headers()
    })

    if(!session){
      return new Response(
        `You've to Login first`, 
        { status: 401 }
      );
    }

    // Check if chat exists
    const existingChat = await prisma.chat.findUnique({
      where: { id }
    });

    if (!existingChat) {
      // Create new chat with the provided ID
      const { chat, error } = await createChat(lastMessage, id!, session.session.userId);
      if (error || !chat) {
        return new Response(error || 'Failed to create chat', { status: 500 });
      }
    } else if(existingChat.userId === session.session.userId) {
      // Add message to existing chat
      const { error } = await addMessageToChat(id!, lastMessage);
      if (error) {
        return new Response(error, { status: 500 });
      }
    } else {
      // User tried to add to another users chat
      return new Response("Unauthorized", {status: 401})
    }

    // Stream the response from Gemini
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages: messages,
      onFinish: async ({ response }) => {
        if (id) {
          try {
            const assistantMessage = response.messages.find(
              (message) => message.role === 'assistant'
            );

            if (assistantMessage) {
              // Extract text content from the assistant message
              const textContent = Array.isArray(assistantMessage.content) 
                ? assistantMessage.content
                    .filter(part => part.type === 'text')
                    .map(part => (part as any).text)
                    .join('')
                : assistantMessage.content;

              const aiMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: textContent,
                createdAt: new Date()
              };
              
              await addMessageToChat(id, aiMessage);
            }
          } catch (error) {
            console.error('Failed to save AI message:', error);
          }
        }
      }
    });

    

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 

