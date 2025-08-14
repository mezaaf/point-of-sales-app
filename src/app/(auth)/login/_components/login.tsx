"use client";

import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from "@/constants/auth-constant";
import { LoginForm, loginFormSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { login, loginWithGoogle } from "../actions";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const [loginState, loginAction, isPendingLogin] = useActionState(
    login,
    INITIAL_STATE_LOGIN_FORM
  );

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([keyof, value]) => {
      formData.append(keyof, value);
    });

    startTransition(() => {
      loginAction(formData);
    });
  });

  useEffect(() => {
    if (loginState.status === "error") {
      toast.error("Login Failed", {
        description: loginState.errors._form?.[0],
      });
      startTransition(() => {
        loginAction(null);
      });
    }
  }, [loginState]);

  const handleLoginGoogle = () => {
    startTransition(async () => {
      await loginWithGoogle();
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome</CardTitle>
        <CardDescription>Login to access all features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormInput
              type="email"
              form={form}
              name="email"
              label="Email"
              placeholder="Insert your email address"
              autoComplete="off"
            />
            <FormInput
              type="password"
              form={form}
              name="password"
              label="Password"
              placeholder="********"
              autoComplete="off"
            />

            <Button disabled={isPendingLogin} type="submit" className="w-full">
              {isPendingLogin ? <Loader className="animate-spin" /> : "Login"}
            </Button>
          </form>
        </Form>
        <div className="grid grid-cols-3 items-center gap-4 w-full">
          <Separator className="" />
          <p className="text-sm text-center text-nowrap text-muted-foreground">
            Or continue with
          </p>
          <Separator className="" />
        </div>
        <Button
          onClick={handleLoginGoogle}
          className="w-full"
          variant={"outline"}
        >
          Google
        </Button>
      </CardContent>
    </Card>
  );
};

export default Login;
