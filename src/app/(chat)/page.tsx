import ChatInput from "@/components/chat/input";


export default function Page(){
    return (
        <div className="flex flex-col h-full w-full items-center justify-center">
            <h1 className="text-2xl font-bold">Chat Page</h1>

            <ChatInput />
        </div>
    )
}