"use client";

import { Message, useChat } from "@ai-sdk/react";
import ChatMessage from "@/components/chat/message";
import ChatInput from "@/components/chat/input";
import { createChat, addMessageToChat, getChat } from "@/lib/actions/chat";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    initialMessages: Message[]
    chatId: string;
}

export default function ChatMessages({initialMessages, chatId}: Props) {
  const { messages, input, handleInputChange, handleSubmit, error, reload, status } = useChat({
    api: "/api/chat",
    id: chatId,
    initialMessages,
    onFinish: async () => {
        if(initialMessages.length == 1)
            window.history.replaceState(null, '', `/chat/${chatId}`);
    }
  });

  return (
    <div className="flex flex-col h-screen">
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
          <ChatMessage key={i} message={message} />
        ))}
        
        {/* Generating animation - show when submitted, hide when streaming */}
        <AnimatePresence>
          {status === "submitted" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex w-full mb-4 justify-start"
            >
              <div className="w-11/12 mx-auto">
                <div className="w-auto p-3 rounded-lg shadow-md bg-card text-card-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-4 border-t">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={status === "submitted" || status === "streaming"}
        />
      </div>
    </div>
  );
}