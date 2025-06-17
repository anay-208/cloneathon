import { getChat } from "@/lib/actions/chat";
import Chat from "./chat";

interface Props {
  params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: Props) {
  const { chatId } = await params;
  const { chat, error } = await getChat(chatId);
  console.log(chat, error)
  if (error || !chat) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load chat</p>
      </div>
    );
  }

  return <Chat initialChat={chat} />;
} 