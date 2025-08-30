"use server";

import { createClient } from "@/lib/supabase/server";
import { FormState } from "@/types/general";
import { Cart, OrderFormState } from "@/types/order";
import {
  orderFormSchema,
  orderTakeawayFormSchema,
} from "@/validations/order-validation";
import { redirect } from "next/navigation";
import midtrans from "midtrans-client";
import { environment } from "@/configs/environment";

export async function createOrder(
  prevState: OrderFormState,
  formData: FormData
) {
  const validateFields = orderFormSchema.safeParse({
    customer_name: formData.get("customer_name"),
    table_id: formData.get("table_id"),
    status: formData.get("status"),
  });

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  const orderId = `ZAFCAFE-${Date.now()}`;

  const [orderResult, tableResult] = await Promise.all([
    supabase.from("orders").insert({
      order_id: orderId,
      customer_name: validateFields.data.customer_name,
      table_id: validateFields.data.table_id,
      status: validateFields.data.status,
    }),
    supabase
      .from("tables")
      .update({
        status:
          validateFields.data.status === "reserved"
            ? "reserved"
            : "unavailable",
      })
      .eq("id", validateFields.data.table_id),
  ]);

  const orderError = orderResult.error;
  const tableError = tableResult.error;

  if (orderError || tableError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [
          ...(orderError ? [orderError.message] : []),
          ...(tableError ? [tableError.message] : []),
        ],
      },
    };
  }
  return { status: "success" };
}

export async function createOrderTakeaway(
  prevState: OrderFormState,
  formData: FormData
) {
  const validateFields = orderTakeawayFormSchema.safeParse({
    customer_name: formData.get("customer_name"),
  });

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  const orderId = `ZAFCAFE-${Date.now()}`;

  const { error } = await supabase.from("orders").insert({
    order_id: orderId,
    customer_name: validateFields.data.customer_name,
    status: "process",
  });

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }
  return { status: "success" };
}

export async function updateReservation(
  prevState: FormState,
  formData: FormData
) {
  const supabase = await createClient();

  const [orderResult, tableResult] = await Promise.all([
    supabase
      .from("orders")
      .update({
        status: formData.get("status"),
      })
      .eq("id", formData.get("id")),
    supabase
      .from("tables")
      .update({
        status:
          formData.get("status") === "process" ? "unavailable" : "available",
      })
      .eq("id", formData.get("table_id")),
  ]);

  const orderError = orderResult.error;
  const tableError = tableResult.error;

  if (orderError || tableError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [
          ...(orderError ? [orderError.message] : []),
          ...(tableError ? [tableError.message] : []),
        ],
      },
    };
  }
  return { status: "success" };
}

export async function addOrderItem(
  prevState: OrderFormState,
  data: {
    order_id: string;
    items: Cart[];
  }
) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const payload = data.items.map(({ menu, ...item }) => item);

  const { error } = await supabase.from("orders_menus").insert(payload);

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState,
        _form: [],
      },
    };
  }

  redirect(`/order/${data.order_id}`);
}

export async function updateStatusOrderItem(
  prevState: FormState,
  formData: FormData
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders_menus")
    .update({
      status: formData.get("status"),
    })
    .eq("id", formData.get("id"));

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function generatePayment(
  prevState: FormState,
  formData: FormData
) {
  const supabase = await createClient();
  const orderId = formData.get("id");
  const grossAmount = formData.get("gross_amount");
  const customerName = formData.get("customer_name");

  const snap = new midtrans.Snap({
    isProduction: false,
    serverKey: environment.MIDTRANS_SERVER_KEY!,
  });

  const parameter = {
    transaction_details: {
      order_id: `${orderId}`,
      gross_amount: parseFloat(grossAmount as string),
    },
    customer_details: {
      first_name: customerName,
    },
  };

  const result = await snap.createTransaction(parameter);

  if (result.error_messages) {
    return {
      status: "error",
      errors: {
        ...prevState,
        _form: [result.error_messages],
      },
      data: {
        payment_token: "",
      },
    };
  }

  await supabase
    .from("orders")
    .update({ payment_token: result.token })
    .eq("order_id", orderId);

  return {
    status: "success",
    data: {
      payment_token: `${result.token}`,
    },
  };
}
