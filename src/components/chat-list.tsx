import { auth } from "@/lib/auth"
import ChatListClient from "./chat-list.client";
import { listChats } from "@/lib/actions/chat";

type SessionType = ReturnType<typeof auth.api.getSession>

interface ChatListProps {
  session: SessionType
}

export default async function ChatList({ session }: ChatListProps) {
    const sessionResolved = await session;
    if(!sessionResolved?.session.id){
        return null; // Don't show anything if not authenticated
    }
    
    let {chats, error} = await listChats(sessionResolved.user.id)
    if(error || !chats){
        return;
        // TODO: return failed to fetch chats
    }

    return <ChatListClient chats={chats} />
}


