import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { INITIAL_STATE_GENERATE_PAYMENT } from "@/constants/order-constant";
import { usePricing } from "@/hooks/use-pricing";
import { convertIDR } from "@/lib/utils";
import { Menu } from "@/validations/menu-validation";
import { Loader } from "lucide-react";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { generatePayment } from "../../actions";
import { useAuthStore } from "@/stores/auth-store";

export default function Summary({
  order,
  orderMenu,
  id,
}: {
  order: {
    customer_name: string;
    tables: { name: string }[];
    status: string;
    payment_token: string;
  };
  orderMenu:
    | { menus: Menu; quantity: number; nominal: number; status: string }[]
    | null
    | undefined;
  id: string;
}) {
  const { grandTotal, totalPrice, tax, service } = usePricing(orderMenu);

  const isAllServed = useMemo(() => {
    return orderMenu?.every((item) => item.status === "served");
  }, [orderMenu]);

  const [
    generatePaymentState,
    generatePaymentAction,
    isPendingGeneratePayment,
  ] = useActionState(generatePayment, INITIAL_STATE_GENERATE_PAYMENT);

  const handleGeneratePayment = () => {
    if (order?.payment_token) {
      window.snap.pay(order.payment_token);
    } else {
      const formData = new FormData();
      formData.append("id", id || "");
      formData.append("gross_amount", grandTotal.toString());
      formData.append("customer_name", order.customer_name || "");

      startTransition(() => {
        generatePaymentAction(formData);
      });
    }
  };

  useEffect(() => {
    if (generatePaymentState.status === "error") {
      toast.error("Generate Payment Failed", {
        description: generatePaymentState.errors?._form?.[0],
      });
    }
    if (generatePaymentState?.status === "success") {
      window.snap.pay(generatePaymentState.data.payment_token);
    }
  }, [generatePaymentState]);

  const profile = useAuthStore((state) => state.profile);
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        {order && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={order.customer_name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Table</Label>
              <Input
                value={
                  (order.tables as unknown as { name: string })?.name ||
                  "Takeaway"
                }
                disabled
              />
            </div>
          </div>
        )}
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <h3 className="text-xs font-semibold">{id}</h3>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">Subtotal</p>
            <p className="text-sm">{convertIDR(totalPrice)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">Tax (12%)</p>
            <p className="text-sm">{convertIDR(tax)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">Tax (5%)</p>
            <p className="text-sm">{convertIDR(service)}</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Grand Total</p>
            <p className="text-lg font-semibold">{convertIDR(grandTotal)}</p>
          </div>
          {order.status === "process" && profile.role !== "kitchen" && (
            <Button
              type="submit"
              onClick={handleGeneratePayment}
              disabled={
                !isAllServed ||
                isPendingGeneratePayment ||
                orderMenu?.length === 0
              }
              className={`w-full font-semibold bg-teal-500 hover:bg-teal-600 text-white ${
                isPendingGeneratePayment || !isAllServed
                  ? "cursor-not-allowed!"
                  : "cursor-pointer!"
              }`}
            >
              {isPendingGeneratePayment ? (
                <Loader className="animate-spin" />
              ) : (
                "Pay"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
