"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export function ErrorMessage({ code }: { code: string | null }) {
  let message = "";

  if (!code) return null;

  switch (code) {
    case "AccountExistsNoLink":
      message =
        "Masz już konto z tym adresem email. Zaloguj się hasłem, a następnie połącz konto GitHub w ustawieniach.";
      break;
    case "UserNotFound":
      message = "Nie znaleziono konta. Poproś administratora o zaproszenie.";
      break;
    case "CredentialsSignin":
      message = "Błąd logowania. Sprawdź swoje dane i spróbuj ponownie.";
      break;
    default:
      message = "Wystąpił błąd logowania.";
  }

  return (
    <div className="mt-4 rounded-md border-2 border-red-600/10 bg-red-100/25 p-2 text-sm text-red-600">
      {message}
    </div>
  );
}

export function LoginForm({
  errorCode,
  className,
  ...props
}: React.ComponentProps<"div"> & { errorCode?: string | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Panel logowania</CardTitle>
          <CardDescription>
            Zaloguj się za pomocą konta uczelniowego, aby edytować swój profil
          </CardDescription>
          {errorCode && <ErrorMessage code={errorCode} />}
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <form className="flex flex-col gap-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  required
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    signIn("credentials", {
                      email: email,
                      password: password,
                      redirect: true,
                      redirectTo: "/panel/profile",
                    });
                  }}
                  className="w-full"
                >
                  Login
                </Button>
              </form>
            </div>
            <Separator />
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  signIn("github", {
                    redirect: true,
                    redirectTo: "/panel/profile",
                  })
                }
              >
                <Github />
                Login with Github
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Image
                  src="/images/agh_logo.png"
                  alt="AGH Logo"
                  width={12}
                  height={12}
                  className="h-auto w-3"
                />
                Login with AGH Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
