'use server'

import prisma from "@/lib/db";
import { Message } from "@ai-sdk/react";
import { revalidatePath } from "next/cache";
import { google } from "@ai-sdk/google";
import { streamText, generateText } from "ai";

async function generateChatTitle(messages: { role: string; content: string }[]): Promise<string> {
    const prompt = `Given the following conversation, generate a short, concise title (max 5 words) that summarizes the main topic or purpose. Only return the title, nothing else.

Conversation:
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`;

    const result = await generateText({
        model: google('gemini-1.5-flash'),
        prompt,
    });

    return result.text.trim();
}

export async function createChat(firstMessage: Message, chatId: string) {
    try {
        // Generate initial title using AI
        const title = await generateChatTitle([{ role: firstMessage.role, content: firstMessage.content }]);

        const chat = await prisma.chat.create({
            data: {
                id: chatId,
                title,
                messages: {
                    create: {
                        content: firstMessage.content,
                        role: firstMessage.role,
                    }
                }
            },
            include: {
                messages: true
            }
        });

        revalidatePath('/');
        return { chat, error: null };
    } catch (error) {
        console.error('Error creating chat:', error);
        return { chat: null, error: 'Failed to create chat' };
    }
}

export async function addMessageToChat(chatId: string, message: Message) {
    try {
        const newMessage = await prisma.message.create({
            data: {
                content: message.content,
                role: message.role,
                chatId
            }
        });

        // Update chat title if this is the second message
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: { messages: true }
        });

        if (chat && chat.messages.length === 2) {
            const title = await generateChatTitle(chat.messages.map(m => ({ role: m.role, content: m.content })));
            await prisma.chat.update({
                where: { id: chatId },
                data: { title }
            });
        }

        revalidatePath(`/chat/${chatId}`);
        return { message: newMessage, error: null };
    } catch (error) {
        console.error('Error adding message:', error);
        return { message: null, error: 'Failed to add message' };
    }
}

export async function getChat(id: string) {
    try {
        const chat = await prisma.chat.findUnique({
            where: { id },
            include: { messages: true }
        });
        return { chat, error: null };
    } catch (error) {
        return { chat: null, error };
    }
} 