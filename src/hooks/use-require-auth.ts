"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/app-store";
import { LOGIN_REQUIRED_MESSAGE, loginUrl } from "@/lib/auth/routes";

/**
 * Guard for account-only actions that live on public pages — bookmarking a
 * problem, saving a draft, rating a revision. Returns a function that reports
 * whether the action may proceed, and when it may not, explains why and sends
 * the visitor to log in with this page as the destination.
 *
 * Anything that reaches the server is also checked there; this is for the
 * actions that only touch client state, plus immediate feedback for the rest.
 */
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const signedIn = useAppStore((s) => !!s.user);

  return useCallback(
    (description = "Log in to use this.") => {
      if (signedIn) return true;
      toast.error(LOGIN_REQUIRED_MESSAGE, { description });
      router.push(loginUrl(pathname));
      return false;
    },
    [signedIn, router, pathname],
  );
}
