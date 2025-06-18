import ChatMessages from "@/components/chat/main";
import { Message } from "ai";

export default function Page(){
  const initialMessage : Message[] = [{
    content: "Hello, how many I help you today?",
    id: crypto.randomUUID(),
    role: "assistant",
    createdAt: new Date()
  }]
  return (
    <>
      <ChatMessages initialMessages={initialMessage} chatId={crypto.randomUUID()} />
    </>
  )
}