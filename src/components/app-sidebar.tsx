import { Calendar, Home, Inbox, PlusCircle, Search, Settings, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Suspense } from "react"
import ChatList from "./chat-list"
import AuthButtons from "./auth-buttons"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

// Menu items.

function Loading() {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export async function AppSidebar() {
  const session = headers().then(headerList => auth.api.getSession({headers: headerList}))

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chatapp</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-2">
              <Button asChild className="w-full justify-start gap-2">
                <Link href="/">
                  <PlusCircle className="h-4 w-4" />
                  New Chat
                </Link>
              </Button>
            </div>
            <SidebarMenu>
              <Suspense fallback={<Loading />}>
                <ChatList session={session} />
              </Suspense>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Auth buttons at the bottom */}
        <Suspense>
          <AuthButtons session={session} />
        </Suspense>
      </SidebarContent>
    </Sidebar>
  )
}