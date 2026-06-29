'use client';

import React, { useEffect, useState, use } from 'react';
import { getWorkspace, getUpdatesForWorkspace, getUpdateByPeriod } from '@/lib/storage';
import { Update, Workspace } from '@/lib/types';
import DeckShell from '@/components/slideware/DeckShell';
import PasscodeGate from '@/components/PasscodeGate';

interface PageProps {
  params: Promise<{ workspace: string; period: string }>;
}

export default function PeriodPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { workspace: workspaceSlug, period } = resolvedParams;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [update, setUpdate] = useState<Update | null>(null);
  const [allUpdates, setAllUpdates] = useState<Update[]>([]);

  useEffect(() => {
    const ws = getWorkspace(workspaceSlug);
    const updates = getUpdatesForWorkspace(workspaceSlug);
    const foundUpdate = getUpdateByPeriod(workspaceSlug, period);
    setWorkspace(ws);
    setAllUpdates(updates);
    setUpdate(foundUpdate);
  }, [workspaceSlug, period]);

  if (!workspace || !update) {
    return <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center">Update period not found.</div>;
  }

  return (
    <PasscodeGate>
      <DeckShell update={update} workspace={workspace} allUpdates={allUpdates} />
    </PasscodeGate>
  );
}
