"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { APP_NAME } from "@/constants";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Status = "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>(token ? "verifying" : "error");

  useEffect(() => {
    if (!token) return;

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const json = await res.json();

        if (json.success) {
          setStatus("success");
          toast({ title: "Email verified!", description: "Your account is now fully active." });
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }

    verify();
  }, [token, toast]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="text-center space-y-4 px-4">
        <div className="lg:hidden flex justify-center mb-4">
          <Image src="/logo/zkr.jpg" alt={APP_NAME} width={48} height={48} className="rounded-2xl mx-auto shadow-lg" />
        </div>

        {status === "verifying" && (
          <>
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
            <h1 className="text-2xl font-bold">Verifying your email</h1>
            <p className="text-sm text-muted-foreground">This will just take a moment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h1 className="text-2xl font-bold">Email verified</h1>
            <p className="text-sm text-muted-foreground">Your email address has been confirmed. You&apos;re all set.</p>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Verification failed</h1>
            <p className="text-sm text-muted-foreground">
              This link is invalid or has expired. You can request a new one from your profile once signed in.
            </p>
            <Button variant="outline" asChild>
              <Link href="/login"><ArrowLeft className="mr-2 h-4 w-4" />Back to login</Link>
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
