import { getChat, listChats } from "@/lib/actions/chat";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session){
        return NextResponse.json({
            message: "Unauthorized"
        }, {
            status: 401
        })
    }

    const {chats, error} = await listChats(session.user.id);

    if(error){
        return NextResponse.json({
            message: "An Unknown error occured"
        })
    }
    return NextResponse.json({chats})


}
