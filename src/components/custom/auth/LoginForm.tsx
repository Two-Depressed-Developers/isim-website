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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Panel logowania</CardTitle>
          <CardDescription>
            Zaloguj się za pomocą konta uczelniowego, aby edytować swój profil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
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
