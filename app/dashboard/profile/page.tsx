"use client";

import { useEffect, useState } from "react";

type ProfileData = {
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setProfile(data.data))
      .catch(() => setProfile(null));
  }, []);

  if (!profile) {
    return <div className="h-40 animate-pulse rounded-2xl bg-white/70" />;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Profile</h2>
        <p className="mt-2 text-sm text-slate-600">User details are loaded from `/api/user/profile`.</p>
      </div>

      <article className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        <Detail label="Full name" value={profile.name} />
        <Detail label="Email" value={profile.email} />
        <Detail label="Role" value={profile.role} />
        <Detail label="Department" value={profile.department} />
        <Detail label="Location" value={profile.location} />
      </article>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-soft p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}
