import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Require an authenticated user, redirecting to /login when absent. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return { supabase, user };
}