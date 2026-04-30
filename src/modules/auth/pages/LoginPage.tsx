import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/modules/auth/hooks/useLogin";
import { useAppDispatch } from "@/app/hooks";
import { setAuth } from "@/modules/auth/authSlice";
import { getApiErrorMessage } from "@/shared/api/http";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLogin();

  const defaultValues = useMemo<FormValues>(
    () => ({ email: "", password: "" }),
    [],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const result = await loginMutation.mutateAsync(values);
      dispatch(setAuth(result));
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="text-lg font-semibold text-foreground">Login</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Admin and Operator access only.
        </div>

        {error ? (
          <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <form className="mt-4 space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              placeholder="name@companyname.com"
              autoComplete="email"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <div className="text-xs text-red-600">
                {form.formState.errors.email.message}
              </div>
            ) : null}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <div className="text-xs text-red-600">
                {form.formState.errors.password.message}
              </div>
            ) : null}
          </div>

          <Button
            className="w-full"
            disabled={loginMutation.isPending || !form.formState.isValid}
            type="submit"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-xs text-muted-foreground">
            Tip: run backend seed once to create an Admin.
          </div>
        </form>
      </div>
    </div>
  );
}
