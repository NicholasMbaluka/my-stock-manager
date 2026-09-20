"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export type SettingsState = { error?: string; message?: string };

export async function updateProfile(
  _: SettingsState,
  form: FormData,
): Promise<SettingsState> {
  const { supabase, user } = await requireUser();
  const fullName = String(form.get("fullName") ?? "").trim();
  const businessName = String(form.get("businessName") ?? "").trim();

  if (fullName.length < 2) return { error: "Please enter your full name." };
  if (businessName.length < 2)
    return { error: "Please enter your business name." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, business_name: businessName })
    .eq("id", user.id);

  if (error) return { error: "Unable to save your changes. Please try again." };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { message: "Settings saved." };
}