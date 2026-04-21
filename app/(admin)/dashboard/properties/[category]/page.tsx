import Properties from "@/pages/admin/Properties"

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ category: string }>
}>) {
  const { category } = await params
  return <Properties category={category} />
}