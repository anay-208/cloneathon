import { betterAuth } from "better-auth";
import prisma from "./db";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { Resend } from 'resend';
import MagicLinkHTML from "@/emails/magic-link";
const resend = new Resend(process.env.RESEND_API_KEY!);

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    
    plugins: [
        magicLink({
            sendMagicLink: async ({ email, url, }) => {
                console.log(email, url)
                if(process.env.NODE_ENV === "development") return;
                const { data, error } = await resend.emails.send({
                    from: "Unpaid Intern @ ChatApp <chatapp@anayparaswani.dev>",
                    to: email,
                    subject: "Your Magic Link to login to ChatApp",
                    html: MagicLinkHTML.replaceAll("{{URL}}", url), 
                })
                console.log(data, error)
            }
        })
    ],
    //...
})