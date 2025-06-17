import prisma from "@/lib/db"
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import Link from "next/link";

export default async function ChatList() {
    const chats = await prisma.chat.findMany();

    return chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild>
                        <Link href={`/chat/${chat.id}`}>
                            {/* <item.icon /> */}
                            <span>{chat.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))
        
}