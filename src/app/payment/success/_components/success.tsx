"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Success() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");

  const { mutate } = useMutation({
    mutationKey: ["mutateUpdateOrderStatus"],
    mutationFn: async () => {
      const { data } = await supabase
        .from("orders")
        .update({
          status: "settled",
        })
        .eq("order_id", orderId)
        .select()
        .single();

      if (data) {
        await supabase
          .from("tables")
          .update({
            status: "available",
          })
          .eq("id", data.table_id);
      }
    },
  });

  useEffect(() => {
    mutate();
  }, [orderId]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <CheckCircle className="size-16 text-green-400" />
      <h1 className="text-2xl font-bold">Payment Success</h1>
      <Link href={"/order"}>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
          Back To Order
        </Button>
      </Link>
    </div>
  );
}
