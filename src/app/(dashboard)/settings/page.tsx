"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Loader2, Save, Trash2, Moon, Sun, Monitor, CreditCard, Sparkles } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Settings {
  theme: string;
  notifications: { productUpdates: boolean; aiCreditAlerts: boolean; marketingEmails: boolean };
  privacy: { profileVisible: boolean };
}

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { accessToken, logout, user } = useAuthStore();
  const [managingBilling, setManagingBilling] = useState(false);

  async function handleManageBilling() {
    setManagingBilling(true);
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Couldn't open billing portal.");
      window.location.href = json.data.url;
    } catch (error) {
      toast({ title: "Couldn't open billing", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setManagingBilling(false);
    }
  }

  const { setTheme } = useTheme();

  const [settings, setSettings] = useState<Settings | null>(null);
  const [savingNotifications, setSavingNotifications] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  function authHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings", { headers: authHeaders(), credentials: "include" });
        const json = await res.json();
        if (res.ok && json.success) setSettings(json.data);
      } catch {
        // non-critical
      }
    }
    if (accessToken) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function updateSettings(patch: Partial<Settings>) {
    setSavingNotifications(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      setSettings(json.data);
    } catch (error) {
      toast({ title: "Couldn't save settings", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setSavingNotifications(false);
    }
  }

  function handleThemeChange(value: string) {
    setTheme(value);
    updateSettings({ theme: value });
  }

  async function handleChangePassword() {
    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Couldn't change password.");
      toast({ title: "Password changed" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast({ title: "Couldn't change password", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({ password: deletePassword }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Couldn't delete account.");
      toast({ title: "Account deleted", description: "We're sorry to see you go." });
      router.push("/");
    } catch (error) {
      toast({ title: "Couldn't delete account", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences and account.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Appearance</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleThemeChange(opt.value)}
                aria-pressed={settings?.theme === opt.value}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  settings?.theme === opt.value ? "border-primary bg-primary/5" : "hover:bg-accent"
                )}
              >
                <opt.icon className="h-5 w-5" />
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {settings && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Product updates</p>
                  <p className="text-xs text-muted-foreground">New features and improvements</p>
                </div>
                <Switch
                  checked={settings.notifications.productUpdates}
                  disabled={savingNotifications}
                  onCheckedChange={(checked) => updateSettings({ notifications: { ...settings.notifications, productUpdates: checked } })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">AI credit alerts</p>
                  <p className="text-xs text-muted-foreground">Notify me when credits run low</p>
                </div>
                <Switch
                  checked={settings.notifications.aiCreditAlerts}
                  disabled={savingNotifications}
                  onCheckedChange={(checked) => updateSettings({ notifications: { ...settings.notifications, aiCreditAlerts: checked } })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Marketing emails</p>
                  <p className="text-xs text-muted-foreground">Occasional tips and offers</p>
                </div>
                <Switch
                  checked={settings.notifications.marketingEmails}
                  disabled={savingNotifications}
                  onCheckedChange={(checked) => updateSettings({ notifications: { ...settings.notifications, marketingEmails: checked } })}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Current Password</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <Button onClick={handleChangePassword} disabled={changingPassword || !currentPassword || !newPassword}>
            {changingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CreditCard className="h-4 w-4" />Billing</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium flex items-center gap-2">
              {user?.plan === "PRO" ? "Pro Plan" : "Free Plan"}
              {user?.plan === "PRO" && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user?.plan === "PRO" ? "Manage your subscription, payment method, and invoices." : "Upgrade for unlimited resumes and more AI credits."}
            </p>
          </div>
          {user?.plan === "PRO" ? (
            <Button variant="outline" onClick={handleManageBilling} disabled={managingBilling}>
              {managingBilling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Manage Billing
            </Button>
          ) : (
            <Button asChild>
              <a href="/pricing">Upgrade to Pro</a>
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader><CardTitle className="text-lg text-destructive">Danger Zone</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Deleting your account is permanent and removes all your resumes, downloads, and data.
          </p>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />Delete Account
          </Button>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete your account?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This cannot be undone. Enter your password to confirm.</p>
          <Input type="password" placeholder="Password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting || !deletePassword}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
