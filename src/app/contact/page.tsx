"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { contactValidator, type ContactDto } from "@/validators/contact.validator";
import { FOOTER_LINKS } from "@/constants";

export default function ContactPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactDto>({
    resolver: zodResolver(contactValidator),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(dto: ContactDto) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Couldn't send your message.");
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      reset();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Get in touch</h1>
            <p className="mt-3 text-muted-foreground">Questions, feedback, or partnership ideas — we&apos;d love to hear from you.</p>
          </div>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" {...register("subject")} aria-invalid={!!errors.subject} />
                  {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={5} {...register("message")} aria-invalid={!!errors.message} />
                  {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href={`mailto:${FOOTER_LINKS.email}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />{FOOTER_LINKS.email}
            </a>
            <a href={FOOTER_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <MessageCircle className="h-4 w-4" />WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
