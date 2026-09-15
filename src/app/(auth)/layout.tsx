import Image from "next/image";
import { APP_NAME } from "@/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden border-r">
        <Image src="/hero/hero.jpg" alt="" fill className="object-cover object-[60%_30%] -z-20 opacity-[0.4] dark:opacity-[0.28]" />
        <div className="absolute inset-0 -z-10 bg-background/80" />
        <div className="relative text-center space-y-6 max-w-md">
          <Image src="/logo/zkr.jpg" alt={APP_NAME} width={72} height={72} className="rounded-2xl mx-auto border" />
          <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="text-muted-foreground leading-relaxed">Build professional, ATS-optimized resumes with AI-powered writing assistance.</p>
        </div>
      </div>
      <div className="flex-1 px-6 py-12 sm:px-8 sm:py-16 lg:flex lg:items-center lg:justify-center lg:py-8">
        <div className="w-full max-w-md mx-auto">{children}</div>
      </div>
    </div>
  );
}