"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Shield, Mail, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { user, accessToken, setUser } = useAuthStore();
  const { toast } = useToast();
  const [resendingVerification, setResendingVerification] = useState(false);

  async function handleResendVerification() {
    setResendingVerification(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Couldn't resend verification email.");
      toast({ title: "Verification email sent", description: "Check your inbox for the link." });
    } catch (error) {
      toast({ title: "Couldn't resend email", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setResendingVerification(false);
    }
  }

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setBio(user.bio ?? "");
      setLocation(user.location ?? "");
    }
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ name, bio, location }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Couldn't update profile.");
      setUser(json.data.user);
      toast({ title: "Profile updated" });
    } catch (error) {
      toast({ title: "Update failed", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your public profile information.</p>
      </div>

      {!user.emailVerified && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>Your email address isn&apos;t verified yet.</span>
            <Button size="sm" variant="outline" onClick={handleResendVerification} disabled={resendingVerification}>
              {resendingVerification && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Resend email
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar ?? undefined} alt={user.name ?? user.email} />
            <AvatarFallback className="text-lg">{(user.name ?? user.email).charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user.name || "Unnamed User"}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{user.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={user.emailVerified ? "default" : "secondary"} className="text-xs">
                {user.emailVerified ? "Verified" : "Unverified"}
              </Badge>
              {user.role === "ADMIN" && (
                <Badge variant="outline" className="text-xs gap-1"><Shield className="h-3 w-3" />Admin</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell us a little about yourself" />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Member since {formatDate(user.createdAt)}
        </CardContent>
      </Card>
    </div>
  );
}
