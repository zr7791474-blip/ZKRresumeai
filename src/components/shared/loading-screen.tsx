import Image from "next/image";
import { APP_NAME } from "@/constants";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="relative">
        <Image src="/logo/zkr.jpg" alt={APP_NAME} width={48} height={48} className="rounded-full animate-pulse" priority />
        <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-ping" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}