"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string };

const emailOk = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function callbackUrl() {
  return `${
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  }/auth/callback?next=%2Fdashboard`;
}

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  if (!emailOk(email)) return { error: "Please enter a valid email." };
  if (!password) return { error: "Please enter your password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: "Incorrect email or password." };
  redirect("/dashboard");
}

export async function signUp(_: FormState, form: FormData): Promise<FormState> {
  const fullName = String(form.get("fullName") ?? "").trim();
  const businessName = String(form.get("businessName") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirmPassword") ?? "");

  if (fullName.length < 2) return { error: "Please enter your full name." };
  if (businessName.length < 2) return { error: "Please enter your business name." };
  if (!emailOk(email)) return { error: "Please enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, business_name: businessName },
      emailRedirectTo: callbackUrl(),
    },
  });

  if (error) {
    return {
      error:
        error.message.toLowerCase().includes("already")
          ? "An account with this email already exists."
          : "We could not create your account. Please try again.",
    };
  }

  if (!data.session) {
    return { message: "Check your email to confirm your account, then sign in." };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}