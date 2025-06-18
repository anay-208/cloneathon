"use client";
import { cn } from "@/lib/utils";
import { Message as MessageProps } from "@/lib/validators/message";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

    const formatDateTime = (date: Date) => {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <TooltipProvider>
            <div className={cn(
                "flex w-full mb-4",
                isUser ? "justify-end" : "justify-start"
            )}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={cn(
                            "max-w-md p-3 rounded-lg shadow-md cursor-default",
                            isUser ? "bg-secondary text-secondary-foreground" : "bg-card text-card-foreground"
                        )}>
                            <p className="text-sm">{message.content}</p>
                        </div>
                    </TooltipTrigger>
                    {date && (
                        <TooltipContent>
                            <p>{formatDateTime(date)}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}