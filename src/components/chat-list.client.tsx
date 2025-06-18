"use client"
import { Chat } from "@prisma/client"
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { MoreHorizontal, Edit2, Trash2, X, Check } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { cn } from "@/lib/utils"

export default function ChatListClient({chats}: {chats: Chat[]}){
    const [chatsState, setChatsState] = useState<Chat[]>(chats)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // When a new chat is created, add it to sidebar automatically
        fetch("/api/chats").then(res => res.json()).then(json => {
            setChatsState(json.chats || []);
        }).catch(error => {
            console.error("Error fetching chats:", error);
        });
    }, [pathname])

    const handleEdit = async (chatId: string) => {
        if (!editTitle.trim()) {
            toast.error("Title cannot be empty");
            return;
        }
        
        try {
            const response = await fetch(`/api/chats/${chatId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle })
            });

            if (response.ok) {
                const { chat } = await response.json();
                setChatsState(prev => prev.map(c => c.id === chatId ? chat : c));
                setEditingId(null);
                setEditTitle("");
                toast.success("Chat title updated successfully");
            } else {
                const error = await response.json();
                toast.error(error.error || "Failed to update chat title");
            }
        } catch (error) {
            console.error('Error updating chat:', error);
            toast.error("Failed to update chat title");
        }
    };

    const handleDelete = async (chatId: string) => {
        try {
            const response = await fetch(`/api/chats/${chatId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setChatsState(prev => prev.filter(c => c.id !== chatId));
                setIsDeleteDialogOpen(false);
                setDeletingId(null);
                toast.success("Chat deleted successfully");
                
                // If we're on the deleted chat page, redirect to home
                if (pathname === `/chat/${chatId}`) {
                    router.push('/');
                }
            } else {
                const error = await response.json();
                toast.error(error.error || "Failed to delete chat");
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            toast.error("Failed to delete chat");
        }
    };

    const startEdit = (chat: Chat) => {
        setEditingId(chat.id);
        setEditTitle(chat.title);
    };

    const confirmDelete = (chatId: string) => {
        setDeletingId(chatId);
        setIsDeleteDialogOpen(true);
    };

    return (
        <AnimatePresence mode="popLayout">
            {chatsState
                .sort((a, b) => {
                    // Put current chat at the top
                    if (pathname === `/chat/${a.id}`) return -1;
                    if (pathname === `/chat/${b.id}`) return 1;
                    // Sort others by creation date (newest first)
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .map((chat, index) => (
                <motion.div
                    key={chat.id}
                    initial={{ 
                        opacity: 0, 
                        x: -50, 
                        scale: 0.8,
                        rotateY: -15
                    }}
                    animate={{ 
                        opacity: 1, 
                        x: 0, 
                        scale: 1,
                        rotateY: 0
                    }}
                    exit={{ 
                        opacity: 0, 
                        x: 50, 
                        scale: 0.8,
                        rotateY: 15
                    }}
                    transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        delay: index * 0.1,
                        duration: 0.5
                    }}
                    layout
                    layoutId={chat.id}
                >
                    <SidebarMenuItem>
                        <motion.div 
                            className={cn(
                                "flex items-center w-full group",
                                pathname === `/chat/${chat.id}` && "bg-muted/50 rounded-md"
                            )}
                            animate={pathname === `/chat/${chat.id}` ? {
                                scale: 1.02
                            } : {
                                scale: 1
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut"
                            }}
                        >
                            <SidebarMenuButton asChild className="flex-1">
                                <Link href={`/chat/${chat.id}`}>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                    >
                                        {editingId === chat.id ? (
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="bg-transparent border-none outline-none w-full"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleEdit(chat.id);
                                                    if (e.key === 'Escape') {
                                                        setEditingId(null);
                                                        setEditTitle("");
                                                    }
                                                }}
                                            />
                                        ) : (
                                            chat.title
                                        )}
                                    </motion.span>
                                </Link>
                            </SidebarMenuButton>
                            
                            {/* Action buttons */}
                            <AnimatePresence>
                                {editingId === chat.id ? (
                                    <motion.div
                                        key="edit-buttons"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex gap-1 mr-2"
                                    >
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(chat.id)}
                                            className="h-6 w-6 p-0"
                                        >
                                            <Check className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditTitle("");
                                            }}
                                            className="h-6 w-6 p-0"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="dropdown"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity mr-2"
                                    >
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <MoreHorizontal className="h-3 w-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem onClick={() => startEdit(chat)}>
                                                    <Edit2 className="h-4 w-4 mr-2" />
                                                    Edit title
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => confirmDelete(chat.id)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete chat
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </SidebarMenuItem>
                </motion.div>
            ))}
            
            {/* Delete confirmation dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Chat</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this chat? This action cannot be undone and all messages will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setDeletingId(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deletingId && handleDelete(deletingId)}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AnimatePresence>
    )
}