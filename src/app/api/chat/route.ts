import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { Message } from "@ai-sdk/react";
import { createChat, addMessageToChat } from "@/lib/actions/chat";
import prisma from "@/lib/db";

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

    // Check if chat exists
    const existingChat = await prisma.chat.findUnique({
      where: { id }
    });

    if (!existingChat) {
      // Create new chat with the provided ID
      const { chat, error } = await createChat(lastMessage, id!);
      if (error || !chat) {
        return new Response(error || 'Failed to create chat', { status: 500 });
      }
    } else {
      // Add message to existing chat
      const { error } = await addMessageToChat(id!, lastMessage);
      if (error) {
        return new Response(error, { status: 500 });
      }
    }

    // Stream the response from Gemini
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      prompt: lastMessage.content,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 