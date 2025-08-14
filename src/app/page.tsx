"use client";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

export default function Home() {
  const profile = useAuthStore((state) => state.profile);
  return (
    <div className="bg-muted flex justify-center items-center h-screen flex-col space-y-4 relative">
      <h1 className="text-4xl font-semibold capitalize">
        Welcome {profile.name}
      </h1>
      <Link href={profile.role === "admin" ? "/admin" : "/order"}>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
          Access Dashboard
        </Button>
      </Link>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
