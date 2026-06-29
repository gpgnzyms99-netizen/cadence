'use client';

import React, { useEffect, useState } from 'react';
import { getWorkspace, getUpdateByPeriod } from '@/lib/storage';
import { Update, Workspace } from '@/lib/types';
import AdminEditor from '@/components/admin/AdminEditor';
import AdminPasscodeGate from '@/components/admin/AdminPasscodeGate';

export default function AdminPage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [update, setUpdate] = useState<Update | null>(null);

  useEffect(() => {
    const ws = getWorkspace('ttc');
    const latest = getUpdateByPeriod('ttc');
    setWorkspace(ws);
    setUpdate(latest);
  }, []);

  if (!workspace || !update) {
    return <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center">Loading Cadence Studio...</div>;
  }

  return (
    <AdminPasscodeGate>
      <AdminEditor initialUpdate={update} initialWorkspace={workspace} />
    </AdminPasscodeGate>
  );
}
