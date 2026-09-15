"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { resetPasswordValidator, type ResetPasswordDto } from "@/validators/auth.validator";
import { APP_NAME } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordDto>({
    resolver: zodResolver(resetPasswordValidator),
    defaultValues: { token: token ?? "", password: "" },
  });


  async function onSubmit(dto: ResetPasswordDto) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dto, token: token ?? dto.token }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast({ title: "Reset failed", description: json.error || "Invalid or expired token.", variant: "destructive" });
        return;
      }

      setIsSuccess(true);
      toast({ title: "Password reset!", description: "You can now sign in with your new password." });
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      toast({ title: "Error", description: "Failed to reset password.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center space-y-4">
        <div className="lg:hidden flex justify-center mb-4">
          <Image src="/logo/zkr.jpg" alt={APP_NAME} width={48} height={48} className="rounded-2xl mx-auto" />
        </div>
        <h1 className="text-2xl font-bold">Invalid link</h1>
        <p className="text-sm text-muted-foreground">This reset link is invalid or missing a token.</p>
        <Button variant="outline" asChild>
          <Link href="/forgot-password"><ArrowLeft className="mr-2 h-4 w-4" />Request New Link</Link>
        </Button>
      </motion.div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
        <h1 className="text-2xl font-bold">Password reset</h1>
        <p className="text-sm text-muted-foreground">Your password has been reset successfully. Redirecting you to sign in...</p>
        <Button variant="outline" asChild>
          <Link href="/login"><ArrowLeft className="mr-2 h-4 w-4" />Go to Login</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="lg:hidden flex items-center gap-2.5 mb-8">
        <Image src="/logo/zkr.jpg" alt={APP_NAME} width={32} height={32} className="rounded-full" />
        <span className="text-lg font-bold">{APP_NAME}</span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Reset your password</h1>
      <p className="text-sm text-muted-foreground mb-8">Choose a new password for your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
              {...register("password")}
              aria-invalid={!!errors.password}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reset Password
        </Button>
      </form>
    </motion.div>
  );
}
