"use client";

import { Card } from '@/components/ui/card'
import React from 'react'
import { AgentPicker } from '../AgentPicker'

function AgentsTab({update}: {update: any}) {
  return (
              <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
                <AgentPicker
                update={update}
                />
              </Card>
  )
}

export default AgentsTab