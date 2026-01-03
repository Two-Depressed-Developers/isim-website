"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import type { Link as LinkType } from "@/types/strapi";

type MobileMenuProps = {
  links: LinkType[];
};

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [expandedLinks, setExpandedLinks] = useState<Set<number>>(new Set());

  const toggleSubLinks = (linkId: number) => {
    setExpandedLinks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(linkId)) {
        newSet.delete(linkId);
      } else {
        newSet.add(linkId);
      }
      return newSet;
    });
  };

  const handleLinkClick = () => {
    setOpen(false);
    setExpandedLinks(new Set());
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col">
          {links.map((link) => {
            const baseUrl = link.page?.slug ?? link.URL;
            const hasSubLinks = link.subLinks && link.subLinks.length > 0;
            const isExpanded = expandedLinks.has(link.id);

            return (
              <div key={link.id} className="flex flex-col">
                <div className="flex items-center justify-between">
                  {hasSubLinks ? (
                    <button
                      onClick={() => toggleSubLinks(link.id)}
                      className="hover:bg-primary/5 flex flex-1 items-center justify-between rounded-md px-4 py-3 text-left text-lg font-semibold transition-colors"
                    >
                      <span>{link.label}</span>
                      <X
                        className={`h-5 w-5 transition-transform ${
                          isExpanded ? "rotate-0" : "rotate-45"
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`}
                      onClick={handleLinkClick}
                      className="hover:bg-primary/5 flex flex-1 items-center rounded-md px-4 py-3 text-lg font-semibold transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>

                {hasSubLinks && isExpanded && (
                  <div className="mt-2 ml-4 flex flex-col gap-1">
                    {link.subLinks?.map((subLink) => {
                      const subUrl = `${baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`}/${subLink.page?.slug ?? subLink.URL}`;
                      return (
                        <Link
                          key={subLink.id}
                          href={subUrl}
                          onClick={handleLinkClick}
                          className="hover:bg-primary/5 rounded-md px-4 py-2 text-base transition-colors"
                        >
                          {subLink.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
                <Separator className="my-2" />
              </div>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
