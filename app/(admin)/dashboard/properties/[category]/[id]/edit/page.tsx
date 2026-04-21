import AgentDetail from "@/pages/admin/AgentDetail"
import PropertyEdit from "@/pages/admin/PropertyEdit";

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{category: string, id: string }>
}>) {
  const { category, id } = await params
  console.log(category, id);
  
  return <PropertyEdit 
  id={id}
  search={category}
  />
}