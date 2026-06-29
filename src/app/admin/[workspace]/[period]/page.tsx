'use client';

import React, { useEffect, useState, use } from 'react';
import { getWorkspace, getUpdateByPeriod } from '@/lib/storage';
import { Update, Workspace } from '@/lib/types';
import AdminEditor from '@/components/admin/AdminEditor';

interface PageProps {
  params: Promise<{ workspace: string; period: string }>;
}

export default function AdminSpecificUpdatePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { workspace: workspaceSlug, period } = resolvedParams;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [update, setUpdate] = useState<Update | null>(null);

  useEffect(() => {
    const ws = getWorkspace(workspaceSlug);
    const foundUpdate = getUpdateByPeriod(workspaceSlug, period);
    setWorkspace(ws);
    setUpdate(foundUpdate);
  }, [workspaceSlug, period]);

  if (!workspace || !update) {
    return <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center">Update not found in Studio.</div>;
  }

  return <AdminEditor initialUpdate={update} initialWorkspace={workspace} />;
}
