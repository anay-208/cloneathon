import { getChat } from "@/lib/actions/chat";
import Chat from "./chat";
import ChatMessages from "@/components/chat/main";

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
  // @ts-expect-error some random prisma bug
  return <ChatMessages initialMessages={chat.messages} chatId={chatId} />;
} 