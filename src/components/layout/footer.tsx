import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, MessageCircle, Instagram, Mail } from "lucide-react";
import { APP_NAME, FOOTER_LINKS } from "@/constants";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image src="/logo/zkr.jpg" alt={APP_NAME} width={32} height={32} className="rounded-full" />
              <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Build professional, ATS-optimized resumes in minutes with AI-powered writing assistance. Stand out from the crowd.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Product</h3>
            <ul className="space-y-2.5">
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Templates</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Connect</h3>
            <ul className="space-y-2.5">
              <li>
                <a href={FOOTER_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                  <Twitter className="h-3.5 w-3.5" /> Twitter
                </a>
              </li>
              <li>
                <a href={FOOTER_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              </li>
              <li>
                <a href={FOOTER_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </li>
              <li>
                <a href={FOOTER_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                  <Instagram className="h-3.5 w-3.5" /> Instagram
                </a>
              </li>
              <li>
                <a href={`mailto:${FOOTER_LINKS.email}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" /> Email
                </a>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">
            Built by{" "}
            <a href={FOOTER_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-foreground transition-colors">
              ZKR
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
