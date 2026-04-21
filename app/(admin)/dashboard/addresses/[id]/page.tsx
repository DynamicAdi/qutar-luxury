import AddressDetail from "@/pages/admin/AddressDetail"
import AgentDetail from "@/pages/admin/AgentDetail"

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const { id } = await params
  return <AddressDetail id={id} />
}