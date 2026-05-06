"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/qlp/Logo";
import { Eye, EyeOff } from "lucide-react";
import heroImg from "@/assets/property-1.jpg";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const [pending, startTransition] = useTransition();

  const onSubmit = (e: any) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!data.success) {
          const errors = data?.errors?.fieldErrors;

          // zod validation errors
          if (errors) {
            const firstError =
              Object.values(errors).flat()?.[0] || "Validation failed";

            toast.error(firstError as string);
            return;
          }

          toast.error(data.message || "Login failed");
          return;
        }

        toast.success(data.message || "Login successful");
        router.push("/dashboard");
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Visual side */}
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src={heroImg.src}
          alt="Luxury villa"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(30_18%_10%/0.85)] via-[hsl(30_18%_10%/0.55)] to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-[hsl(40_30%_95%)]">
          <Logo />
          <div className="max-w-md animate-fade-in-up">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs tracking-[0.2em] uppercase text-primary-glow">
              Welcome to QLP
            </div>
            <h1 className="font-grotesk text-4xl font-light leading-tight">
              Manage Qatar's most{" "}
              <em className="not-italic text-gold-gradient font-medium">
                distinguished
              </em>{" "}
              portfolio.
            </h1>
            <p className="mt-3 text-sm text-[hsl(40_30%_92%/0.75)]">
              Properties, leads and clientele — all in one luxurious workspace.
            </p>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-3xl bg-card p-8 sm:p-10 shadow-card animate-fade-in-up"
        >
          <div className="lg:hidden mb-6">
            <Logo />
          </div>
          <div className="mb-6">
            <h2 className="font-grotesk text-2xl font-semibold">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your QLP console
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                disabled={pending}
                id="username"
                type="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  disabled={pending}
                  id="password"
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password"
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {/* <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="accent-[hsl(var(--primary))]" /> Remember me
              </label>
              {/* <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div> */}

            <Button
              disabled={pending}
              type="submit"
              className="w-full h-11 rounded-xl hover:opacity-80 cursor-pointer text-primary-foreground shadow-gold transition-all"
            >
              Sign in
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo credentials prefilled. Click sign in to enter the console.
          </p>
        </form>
      </div>
    </div>
  );
}
