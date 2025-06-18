"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  return (
    <main className="flex min-h-screen flex-col items-center justify-center w-screen">
      <Card className="max-w-md w-full">

        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>


        <CardContent>
            <div className="grid gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                required
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Button
                disabled={loading}
                className="gap-2"
                onClick={async () => {
                  await signIn.magicLink(
                    {
                      email
                    },
                    {
                      onRequest: () => {
                        setLoading(true);
                      },
                      onResponse: () => {
                        setLoading(false);
                        toast("Magic Link Sent! Please check your email. It might take a few minutes to receive. if you haven't received, please contact me@anayparaswani.dev!")
                      },
                    },
                  );
                }}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Sign-in with Magic Link"
                )}
              </Button>
            </div>



        </CardContent>

      </Card>
    </main>
  );
}