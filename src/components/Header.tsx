"use client";

import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";



export default function Header() {
  const pathname = usePathname();

  const isOnHomePage = pathname === "/";
  const linkRef = isOnHomePage ? "/history" : "/";
  const linkText = isOnHomePage ? "Histórico" : "Home";

  return(
    <header className="flex justify-end p-4 gap-4">
      <Button variant="outline" >
        <Link href={linkRef}>{linkText}</Link>
      </Button>
      <ModeToggle />
    </header>
  )
}