"use client";
import { cn } from "@/lib/utils";
import { Message as MessageProps } from "@/lib/validators/message";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User2 } from "lucide-react";

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
                "flex w-full mb-4 items-end",
                isUser ? "justify-end" : "justify-start"
            )}>
                {/* Avatar */}
                {!isUser && (
                    <div className="flex flex-col items-center mr-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-lg font-bold text-white select-none">
                            <span role="img" aria-label="Bot">🤖</span>
                        </div>
                    </div>
                )}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={cn(
                            "relative max-w-[80%] py-2 px-4 font-sans text-[15px] leading-relaxed",
                            isUser
                                ? "bg-[#1E1E1E] text-white rounded-2xl rounded-br-sm ml-auto shadow-md"
                                : "bg-[#2A2A2A] text-white rounded-2xl rounded-bl-sm mr-auto shadow-md"
                        )} style={{ fontFamily: 'Inter, sans-serif' }}>
                            <div className="prose prose-sm max-w-none dark:prose-invert text-foreground [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_strong]:text-foreground [&_b]:text-foreground [&_code]:!bg-zinc-800 [&_code]:!text-foreground">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Custom styling for headings
                                        h1({ children, ...props }) {
                                            return (
                                                <h1 className="text-foreground text-xl font-bold " {...props}>
                                                    {children}
                                                </h1>
                                            );
                                        },
                                        h2({ children, ...props }) {
                                            return (
                                                <h2 className="text-foreground text-lg font-bold " {...props}>
                                                    {children}
                                                </h2>
                                            );
                                        },
                                        h3({ children, ...props }) {
                                            return (
                                                <h3 className="text-foreground text-base font-bold mb-1" {...props}>
                                                    {children}
                                                </h3>
                                            );
                                        },
                                        h4({ children, ...props }) {
                                            return (
                                                <h4 className="text-foreground text-sm font-bold mb-1" {...props}>
                                                    {children}
                                                </h4>
                                            );
                                        },
                                        h5({ children, ...props }) {
                                            return (
                                                <h5 className="text-foreground text-sm font-bold mb-1" {...props}>
                                                    {children}
                                                </h5>
                                            );
                                        },
                                        h6({ children, ...props }) {
                                            return (
                                                <h6 className="text-foreground text-sm font-bold mb-1" {...props}>
                                                    {children}
                                                </h6>
                                            );
                                        },
                                        // Custom styling for code blocks with copy button
                                        code({ node, className, children, ...props }: any) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const isCodeBlock = className && className.includes('language-');
                                            const [copied, setCopied] = useState(false);
                                            const codeString = String(children).replace(/\n$/, "");
                                            if (isCodeBlock) {
                                                return (
                                                    <div
                                                        className="relative my-2 ml-4 p-4 rounded-lg overflow-hidden bg-[#27272a]  border border-zinc-800"
                                                        style={{ boxShadow: 'none' }}
                                                    >
                                                        <button
                                                            className="absolute top-2 right-2 opacity-70 hover:opacity-100 bg-zinc-800 text-zinc-100 rounded px-2 py-1 text-xs transition z-10"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(codeString);
                                                                setCopied(true);
                                                                setTimeout(() => setCopied(false), 1200);
                                                            }}
                                                            title={copied ? 'Copied!' : 'Copy'}
                                                            type="button"
                                                        >
                                                            {copied ? 'Copied!' : 'Copy'}
                                                        </button>
                                                        <SyntaxHighlighter
                                                            language={match ? match[1] : 'plaintext3'}
                                                            style={atomDark}
                                                            customStyle={{
                                                                display: "hidden",
                                                                fontSize: '15px',
                                                                padding: "200px"
                                                            }}
                                                        >
                                                            {codeString}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                );
                                            }
                                            // Inline code
                                            return (
                                                <code className="bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-sm text-foreground" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        // Custom styling for links
                                        a({ children, href, ...props }) {
                                            return (
                                                <a 
                                                    href={href} 
                                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    {...props}
                                                >
                                                    {children}
                                                </a>
                                            );
                                        },
                                        // Custom styling for lists
                                        ul({ children, ...props }) {
                                            return (
                                                <ul className="list-disc list-inside space-y-1 text-foreground marker:text-foreground" {...props}>
                                                    {children}
                                                </ul>
                                            );
                                        },
                                        ol({ children, ...props }) {
                                            return (
                                                <ol className="list-decimal list-inside space-y-1 text-foreground marker:text-foreground" {...props}>
                                                    {children}
                                                </ol>
                                            );
                                        },
                                        // Custom styling for blockquotes
                                        blockquote({ children, ...props }) {
                                            return (
                                                <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-foreground" {...props}>
                                                    {children}
                                                </blockquote>
                                            );
                                        },
                                        // Custom styling for tables
                                        table({ children, ...props }) {
                                            return (
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>
                                                        {children}
                                                    </table>
                                                </div>
                                            );
                                        },
                                        th({ children, ...props }) {
                                            return (
                                                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-foreground" {...props}>
                                                    {children}
                                                </th>
                                            );
                                        },
                                        td({ children, ...props }) {
                                            return (
                                                <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-foreground" {...props}>
                                                    {children}
                                                </td>
                                            );
                                        },
                                        // Custom styling for paragraphs
                                        p({ children, ...props }) {
                                            return (
                                                <p className="text-foreground " {...props}>
                                                    {children}
                                                </p>
                                            );
                                        }
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </TooltipTrigger>
                    {date && (
                        <TooltipContent>
                            <p>{formatDateTime(date)}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
                {/* User avatar */}
                {isUser && (
                    <div className="flex flex-col items-center ml-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold text-white select-none">
                            <span role="img" aria-label="User">🧑</span>
                        </div>
                    </div>
                )}
            </div>
            {/* Timestamp below bubble */}
            {date && (
                <div className={cn(
                    "w-full text-xs text-zinc-400 mt-[-10px] ",
                    isUser ? "text-right pr-12" : "text-left pl-12"
                )}>
                    {formatDateTime(date)}
                </div>
            )}
        </TooltipProvider>
    );
}