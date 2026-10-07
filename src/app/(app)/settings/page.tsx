"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import { Download, LogOut, RotateCcw, Sparkles } from "lucide-react";
import type { Language } from "@/types";
import { LANGUAGES } from "@/types";
import { useAppStore, dataOf } from "@/store/app-store";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Switch, Textarea } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

function Row({ label, description, children, htmlFor }: { label: string; description?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div><label htmlFor={htmlFor} className="text-sm font-medium">{label}</label>{description && <p className="text-xs text-muted">{description}</p>}</div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const state = useAppStore();
  const user = state.user!;
  const s = state.settings;
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [form, setForm] = useState({ name: user.name, username: user.username, email: user.email, bio: user.bio });
  const [confirm, setConfirm] = useState<"reset" | "demo" | null>(null);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { toast.error("Enter a valid email address"); return; }
    if (!/^[a-z0-9_]{3,24}$/i.test(form.username)) { toast.error("Username must be 3–24 letters, numbers or underscores"); return; }
    state.updateProfile({ name: form.name.trim(), username: form.username, email: form.email, bio: form.bio });
    toast.success("Profile saved");
  };
  const exportData = () => {
    const blob = new Blob([JSON.stringify(dataOf(useAppStore.getState()), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `algo-atlas-progress-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Progress exported");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" />
      <Card>
        <CardHeader><div><CardTitle>Profile</CardTitle><CardDescription>Shown on your profile and the leaderboard</CardDescription></div></CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="name">Name</Label><Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label htmlFor="username">Username</Label><Input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
            <div className="sm:col-span-2"><Button type="submit">Save profile</Button></div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><div><CardTitle>Preferences</CardTitle></div></CardHeader>
        <CardContent className="divide-y divide-border">
          <Row label="Theme" htmlFor="theme"><Select id="theme" value={theme ?? "system"} onChange={(e) => setTheme(e.target.value)}><option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option></Select></Row>
          <Row label="Default language" description="Used when you open a problem. JavaScript runs for real in the browser." htmlFor="lang"><Select id="lang" value={s.preferredLanguage} onChange={(e) => state.updateSettings({ preferredLanguage: e.target.value as Language })}>{LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}</Select></Row>
          <Row label="Editor font size" htmlFor="font"><Select id="font" value={s.editorFontSize} onChange={(e) => state.updateSettings({ editorFontSize: Number(e.target.value) })}>{[12, 13, 14, 15, 16, 18].map((n) => <option key={n} value={n}>{n}px</option>)}</Select></Row>
          <Row label="Daily goal" description="Problems per day" htmlFor="daily"><Select id="daily" value={s.dailyGoal} onChange={(e) => state.updateSettings({ dailyGoal: Number(e.target.value) })}>{[1, 2, 3, 4, 5, 8].map((n) => <option key={n} value={n}>{n}</option>)}</Select></Row>
          <Row label="Weekly goal" description="Problems per week" htmlFor="weekly"><Select id="weekly" value={s.weeklyGoal} onChange={(e) => state.updateSettings({ weeklyGoal: Number(e.target.value) })}>{[5, 10, 15, 20, 30].map((n) => <option key={n} value={n}>{n}</option>)}</Select></Row>
          <Row label="Unlock all topics" description="Skip prerequisite locks on the roadmap"><Switch label="Unlock all topics" checked={s.unlockAllTopics} onChange={(v) => state.updateSettings({ unlockAllTopics: v })} /></Row>
          <Row label="Show problem tags" description="Display tags under titles in problem lists"><Switch label="Show problem tags" checked={s.showTags} onChange={(v) => state.updateSettings({ showTags: v })} /></Row>
          <Row label="Revision reminder emails" description="Saved now; emails are sent once a mail provider is connected"><Switch label="Revision reminder emails" checked={s.emailReminders} onChange={(v) => state.updateSettings({ emailReminders: v })} /></Row>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><div><CardTitle>Your data</CardTitle><CardDescription>Progress is stored in this browser until a database is connected</CardDescription></div></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportData}><Download /> Export progress</Button>
          <Button variant="outline" onClick={() => setConfirm("demo")}><Sparkles /> Load demo data</Button>
          <Button variant="outline" onClick={() => setConfirm("reset")} className="text-danger"><RotateCcw /> Reset progress</Button>
          <Button variant="ghost" onClick={() => { state.logout(); router.replace("/login"); }}><LogOut /> Log out</Button>
        </CardContent>
      </Card>
      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogTitle>{confirm === "reset" ? "Reset all progress?" : "Replace your data with the demo account?"}</DialogTitle>
          <DialogDescription>{confirm === "reset" ? "Solved problems, submissions, revision history, XP and achievements will be deleted. Your profile and settings are kept. This cannot be undone." : "Your current progress will be replaced by the demo account's sample history. Export first if you want to keep it."}</DialogDescription>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { if (confirm === "reset") { state.resetProgress(); toast.success("Progress reset"); } else { state.loginDemo(); toast.success("Demo data loaded"); } setConfirm(null); }}>{confirm === "reset" ? "Reset progress" : "Load demo data"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
