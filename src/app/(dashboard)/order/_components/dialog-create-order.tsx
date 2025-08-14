import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  INITIAL_ORDER_FORM,
  INITIAL_STATE_ORDER,
  STATUS_CREATE_ORDER_LIST,
} from "@/constants/order-constant";
import { OrderForm, orderFormSchema } from "@/validations/order-validation";
import { Table } from "@/validations/table-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createOrder } from "../actions";

export default function DialogCreateOrder({
  tables,
}: {
  tables: Table[] | undefined | null;
}) {
  const form = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: INITIAL_ORDER_FORM,
  });

  const [createOrderState, createOrderAction, isPendingCreateOrder] =
    useActionState(createOrder, INITIAL_STATE_ORDER);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createOrderAction(formData);
    });
  });

  useEffect(() => {
    if (createOrderState.status === "error") {
      toast.error("Create Order Failed", {
        description: createOrderState.errors?._form?.[0],
      });
    }
    if (createOrderState?.status === "success") {
      toast.success("Create Order Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
    }
  }, [createOrderState]);

  return (
    <DialogContent className="max-w-[425px]">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle className="capitalize">Create Order</DialogTitle>
          <DialogDescription>Add a new order</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            <FormInput
              form={form}
              name="customer_name"
              label="Customer Name"
              placeholder="Insert cutomer name here"
            />
            <FormSelect
              form={form}
              name="table_id"
              label="Table"
              selectItem={(tables ?? []).map((table: Table) => ({
                value: `${table.id ?? ""}`,
                label: `${table.name} - ${table.status} - (${table.capacity})`,
                disabled: table.status !== "available",
              }))}
            />

            <FormSelect
              form={form}
              name="status"
              label="Status"
              selectItem={STATUS_CREATE_ORDER_LIST}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button
              disabled={isPendingCreateOrder}
              type="submit"
              className="capitalize"
            >
              {isPendingCreateOrder ? (
                <Loader className="animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
