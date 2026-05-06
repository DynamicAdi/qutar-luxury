"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MeetingsBoard from "@/components/leads/MeetingsBoard";
import FollowUpBoard from "@/components/leads/FollowUpBoard";
import LeadFormInfo from "@/components/leads/LeadFormInfo";
import Tasks from "@/components/leads/Tasks";
export default function LeadManagementWorkspace({ id }: { id: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
      {/* HEADER */}
      <div className="space-y-1 mb-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Lead Nurturing & Action Center
        </h1>
        <p className="text-muted-foreground">
          Manage interactions, meetings, followups, and tasks.
        </p>
      </div>

      <LeadFormInfo id={id} />
      <MeetingsBoard id={id} />
      <FollowUpBoard id={id} />
      <Tasks id={id}/>
    </div>
  );
}
