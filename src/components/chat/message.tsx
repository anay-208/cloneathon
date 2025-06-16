"use client";
import { cn } from "@/lib/utils";
import { Message as MessageProps } from "@/lib/validators/message";
import { useEffect, useState } from "react";

interface Props {
    message: MessageProps;
}

export default function Message({ message }: Props) {
    const [date, setDate] = useState<Date | null>(null);
    const isUser = message.role === "user";

    useEffect(() => {
        if (message.createdAt) {
            setDate(new Date(message.createdAt));
        }
    }, [message.createdAt]);

    return (
        <div className={cn(
            "flex w-full mb-4",
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-md p-3 rounded-lg shadow-md",
                isUser ? "bg-secondary text-secondary-foreground" : "bg-card text-card-foreground"
            )}>
                <p className="text-sm">{message.content}</p>
                {date && (
                    <span className="text-xs opacity-75 mt-1 block">
                        {date.toLocaleTimeString()}
                    </span>
                )}
            </div>
        </div>
    );
}