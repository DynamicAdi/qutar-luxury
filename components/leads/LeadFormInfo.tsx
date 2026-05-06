import { useLead } from "@/hooks/leads/useLeads";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function LeadFormInfo({ id }: { id: string }) {
  const { lead, isLoading } = useLead(id);
  return isLoading || !lead ? (
    <LeadFormSkeleton />
  ) : (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Lead Overview & Interested Property Snapshot</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {lead?.sections?.map((section: any) => (
            <div
              key={section.title}
              className="border rounded-2xl p-4 bg-muted/10"
            >
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                {section.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.fields.map((field: any) => (
                  <div key={field.label}>
                    <label className="block text-xs text-muted-foreground mb-1">
                      {field.label}
                    </label>

                    <Input disabled value={field.value ?? ""} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LeadFormSkeleton() {
  return (
    <Card className="rounded-3xl animate-pulse">
      <CardHeader>
        <div className="h-6 w-60 bg-muted rounded-md" />
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-xl" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
