"use client";

import Link from "next/link";
import { FileText, Sparkles, Download, Plus, ArrowRight, Star } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useResumes } from "@/hooks/use-resumes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: resumes, isLoading } = useResumes();

  const totalResumes = resumes?.length ?? 0;
  const favoriteCount = resumes?.filter((r) => r.isFavorite).length ?? 0;
  const recentResumes = resumes?.slice(0, 4) ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
          <p className="text-sm text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your resumes.</p>
        </div>
        <Button asChild>
          <Link href="/resumes"><Plus className="mr-2 h-4 w-4" />New Resume</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Resumes</p>
              <p className="text-2xl font-bold mt-1">{isLoading ? <Skeleton className="h-8 w-10" /> : totalResumes}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">AI Credits</p>
              <p className="text-2xl font-bold mt-1">{user?.aiCredits ?? 0}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Favorites</p>
              <p className="text-2xl font-bold mt-1">{isLoading ? <Skeleton className="h-8 w-10" /> : favoriteCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-rose-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Resumes</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/resumes">View all <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : recentResumes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No resumes yet"
              description="Create your first resume to get started with AI-powered writing assistance."
              action={<Button asChild><Link href="/resumes"><Plus className="mr-2 h-4 w-4" />Create Resume</Link></Button>}
            />
          ) : (
            <div className="space-y-2">
              {recentResumes.map((resume) => (
                <Link
                  key={resume.id}
                  href={`/resumes/${resume.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{resume.title}</p>
                      <p className="text-xs text-muted-foreground">Updated {formatDate(resume.updatedAt)}</p>
                    </div>
                  </div>
                  <Badge variant={resume.status === "PUBLISHED" ? "default" : "secondary"} className="shrink-0">
                    {resume.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/resumes">
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardContent className="p-6">
              <FileText className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-1">My Resumes</h3>
              <p className="text-sm text-muted-foreground">Manage and edit your resumes</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/templates">
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardContent className="p-6">
              <Sparkles className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Templates</h3>
              <p className="text-sm text-muted-foreground">Browse professional templates</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/settings">
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardContent className="p-6">
              <Download className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your account preferences</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
