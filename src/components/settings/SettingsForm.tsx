"use client";

import { useActionState } from "react";
import { updateProfile, type SettingsState } from "@/app/settings/actions";
import type { Profile } from "@/types/database";

const initial: SettingsState = {};

export function SettingsForm({ profile }: { profile: Profile | null }) {
  const [state, action, pending] = useActionState(updateProfile, initial);

  return (
    <form action={action} className="panel form-card">
      <div className="form-grid">
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            defaultValue={profile?.full_name ?? ""}
            required
            disabled={pending}
          />
        </div>
        <div className="field">
          <label htmlFor="businessName">Business name</label>
          <input
            id="businessName"
            name="businessName"
            defaultValue={profile?.business_name ?? ""}
            required
            disabled={pending}
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input id="email" defaultValue={profile?.email ?? ""} disabled />
        </div>
        <div className="field">
          <label htmlFor="currency">Currency</label>
          <input
            id="currency"
            defaultValue="Configurable via NEXT_PUBLIC_CURRENCY"
            disabled
          />
        </div>
      </div>

      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      {state.message && (
        <p className="form-success" role="status">
          {state.message}
        </p>
      )}

      <div className="form-actions">
        <button className="primary" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}