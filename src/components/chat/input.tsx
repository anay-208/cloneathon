"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}

export default function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
    return (
        <form onSubmit={handleSubmit} className="relative">
            <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="min-h-[60px] w-full resize-none bg-background pr-12 text-base"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as any);
                    }
                }}
            />
            <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 bottom-2 h-8 w-8 bg-secondary hover:bg-secondary/80"
            >
                <SendHorizontal className="h-4 w-4 text-white" />
            </Button>
        </form>
    );
}