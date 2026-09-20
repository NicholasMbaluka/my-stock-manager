import { requireUser } from "@/lib/auth";
import { SettingsForm } from "@/components/settings/SettingsForm";
import type { Profile } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Settings() {
  const { supabase } = await requireUser();
  const { data } = await supabase.from("profiles").select("*").maybeSingle();
  const profile = (data as Profile) ?? null;

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p>Manage your business profile and preferences.</p>
        </div>
      </div>
      <SettingsForm profile={profile} />
    </div>
  );
}