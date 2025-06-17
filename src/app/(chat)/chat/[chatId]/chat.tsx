"use client";

import { useChat } from "@ai-sdk/react";
import Message from "@/components/chat/message";
import ChatInput from "@/components/chat/input";
import { Chat as ChatType } from "@prisma/client";

interface Props {
  initialChat: ChatType & {
    messages: {
      id: string;
      content: string;
      role: string;
      createdAt: Date;
    }[];
  };
}

export default function Chat({ initialChat }: Props) {
  const { messages, input, handleInputChange, handleSubmit, error, reload, isLoading } = useChat({
    api: "/api/chat",
    id: initialChat.id,
    initialMessages: initialChat.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      role: msg.role as "user" | "assistant",
      createdAt: msg.createdAt,
    })),
  });

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold">{initialChat.title}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="text-red-500 text-center mb-4">
            {error.message}
            <button
              onClick={() => reload()}
              className="ml-2 text-sm underline"
            >
              Try again
            </button>
          </div>
        )}
        {messages.map((message, i) => (
          <Message key={i} message={message} />
        ))}
      </div>
      <div className="p-4 border-t">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 