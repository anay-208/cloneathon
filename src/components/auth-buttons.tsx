import { LogOut, LogIn } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"

type SessionType = ReturnType<typeof auth.api.getSession>

interface AuthButtonsProps {
    session: SessionType
}

export default async function AuthButtons({ session }: AuthButtonsProps) {
    const resolvedSession = await session;
    return (
        <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
                <div className="p-2">
                    {resolvedSession?.session.id ? (
                        <Button asChild variant="outline" className="w-full justify-start gap-2">
                            <Link href="/api/auth/signout">
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild variant="outline" className="w-full justify-start gap-2">
                            <Link href="/sign-in">
                                <LogIn className="h-4 w-4" />
                                Sign In
                            </Link>
                        </Button>
                    )}
                </div>
            </SidebarGroupContent>
        </SidebarGroup>
    )
} 