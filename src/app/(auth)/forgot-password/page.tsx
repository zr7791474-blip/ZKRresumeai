"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { forgotPasswordValidator, type ForgotPasswordDto } from "@/validators/auth.validator";
import { APP_NAME } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordValidator),
    defaultValues: { email: "" },
  });

  async function onSubmit(dto: ForgotPasswordDto) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      const json = await res.json();

      if (!res.ok) {
        toast({ title: "Error", description: json.error, variant: "destructive" });
        return;
      }

      setSent(true);
      toast({ title: "Email sent!", description: "Check your inbox for the reset link." });
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="text-center space-y-4 px-4">
          <div className="lg:hidden flex justify-center mb-4">
            <Image src="/logo/zkr.jpg" alt={APP_NAME} width={48} height={48} className="rounded-2xl mx-auto" />
          </div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            If an account exists for that address, we sent a password reset link to it.
          </p>
          <Button variant="outline" asChild>
            <Link href="/login"><ArrowLeft className="mr-2 h-4 w-4" />Back to login</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="lg:hidden flex items-center gap-2.5 mb-8">
        <Image src="/logo/zkr.jpg" alt={APP_NAME} width={32} height={32} className="rounded-full" />
        <span className="text-lg font-bold">{APP_NAME}</span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Forgot password</h1>
      <p className="text-sm text-muted-foreground mb-8">Enter your email to receive a reset link</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="inline-flex items-center font-medium text-primary hover:underline">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />Back to login
        </Link>
      </p>
    </motion.div>
  );
}
