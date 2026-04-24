"use client";

import { Card } from '@/components/ui/card'
import React from 'react'
import { AgentPicker } from '../AgentPicker'
import { Property } from '@/store/cms';

function AgentsTab({p, update}: {p: Property, update: any}) {
  return (
              <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
                <AgentPicker
                p={p}
                update={update}
                />
              </Card>
  )
}

export default AgentsTab