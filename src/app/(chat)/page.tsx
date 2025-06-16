"use client";

import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import ChatInput from "@/components/chat/input";
import ChatMessage from "@/components/chat/message";

export default function ChatPage() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
    });

    return (
        <div className="flex h-full overflow-hidden">
            <div className="flex-1 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((message, i) => (
                        <ChatMessage key={i} message={message} />
                    ))}
                </div>
                <div className="p-4 border-t border-border">
                    <ChatInput
                        input={input}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}