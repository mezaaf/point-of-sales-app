"use client";

import { Button } from "@/components/ui/button";
import { BanIcon } from "lucide-react";
import Link from "next/link";

export default function Failed() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <BanIcon className="size-16 text-red-500" />
      <h1 className="text-2xl font-bold">Payment Failed</h1>
      <Link href={"/order"}>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
          Back To Order
        </Button>
      </Link>
    </div>
  );
}
