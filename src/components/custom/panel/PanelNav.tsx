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
        className="hover:bg-primary/5 flex items-center gap-x-2 rounded-md px-3 py-1 transition-colors"
      >
        <ChevronLeft />
        Powrót do strony głównej
      </Link>
      <div className="flex items-center gap-x-4">
        <Link
          href="/panel/settings"
          className="hover:bg-primary/5 flex items-center gap-x-2 rounded-md px-3 py-1 transition-colors"
        >
          <span className="text-[18px] font-semibold">Ustawienia</span>
        </Link>
        <Link
          href="/panel/profile"
          className="hover:bg-primary/5 flex items-center gap-x-2 rounded-md px-3 py-1 transition-colors"
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
            className="text-foreground hover:bg-primary/5 flex items-center gap-x-2 rounded-md bg-transparent px-3 py-1 transition-colors"
          >
            <LogOut />
          </Button>
        </div>
      </div>
    </nav>
  );
}
