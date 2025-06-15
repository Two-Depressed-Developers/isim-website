"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function PanelNav() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow-sm">
      <Link
        href="/"
        className="flex items-center gap-x-2 rounded-md px-3 py-1 transition-colors hover:bg-primary/5"
      >
        <ChevronLeft />
        Powrót do strony głównej
      </Link>
      <div className="flex items-center gap-x-4">
        <Link
          href="/panel/profile"
          className="flex items-center gap-x-2 rounded-md px-3 py-1 transition-colors hover:bg-primary/5"
        >
          <span className="text-[18px] font-semibold">Profil</span>
        </Link>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-x-2 px-3">
          <p className="font-bold">{session?.user?.email || "Użytkownik"}</p>
          <Button
            onClick={() =>
              signOut({
                redirect: true,
                redirectTo: "/",
              })
            }
            className="flex items-center gap-x-2 rounded-md bg-transparent px-3 py-1 text-foreground transition-colors hover:bg-primary/5"
          >
            <LogOut />
          </Button>
        </div>
      </div>
    </nav>
  );
}
