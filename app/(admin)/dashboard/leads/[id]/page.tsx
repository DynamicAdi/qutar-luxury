import LeadManagementWorkspace from "@/pages/admin/LeadManagement";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LeadManagementWorkspace id={id} />;
}
